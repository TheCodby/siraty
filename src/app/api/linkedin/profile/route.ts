import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createLinkedInAPIService,
  LinkedInAPIError,
} from "@/features/linkedin-sync/services/linkedin-api";
import {
  LinkedInProfile,
  LinkedInPositions,
  LinkedInEducation,
  LinkedInSkills,
} from "@/features/linkedin-sync/types";

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated session
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "No access token found. Please sign in with LinkedIn." },
        { status: 401 }
      );
    }

    // Extract optional query parameters for selective data fetching
    const { searchParams } = new URL(request.url);
    const includeProfile = searchParams.get("profile") !== "false";
    const includeExperience = searchParams.get("experience") !== "false";
    const includeEducation = searchParams.get("education") !== "false";
    const includeSkills = searchParams.get("skills") !== "false";

    // Create LinkedIn API service instance
    const linkedInService = createLinkedInAPIService(session.accessToken);

    // Fetch the complete profile data
    const profileData = await linkedInService.getCompleteProfile();

    // Filter the response based on query parameters
    const filteredData = {
      personalInfo: includeProfile ? profileData.personalInfo : null,
      workExperience: includeExperience ? profileData.workExperience : [],
      education: includeEducation ? profileData.education : [],
      skills: includeSkills ? profileData.skills : [],
    };

    return NextResponse.json({
      success: true,
      data: filteredData,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("LinkedIn profile fetch error:", error);

    if (error instanceof LinkedInAPIError) {
      return NextResponse.json(
        {
          error: "LinkedIn API Error",
          message: error.message,
          statusCode: error.statusCode,
        },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to fetch LinkedIn profile data",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "No access token found. Please sign in with LinkedIn." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sections } = body; // Array of sections to fetch: ['profile', 'experience', 'education', 'skills']

    if (!Array.isArray(sections)) {
      return NextResponse.json(
        { error: "Invalid request format. 'sections' must be an array." },
        { status: 400 }
      );
    }

    const linkedInService = createLinkedInAPIService(session.accessToken);

    type LinkedInSectionData =
      | LinkedInProfile
      | LinkedInPositions
      | LinkedInEducation
      | LinkedInSkills
      | { error: string };

    const results: Record<string, LinkedInSectionData> = {};

    // Fetch only requested sections
    const promises: Promise<void>[] = [];

    if (sections.includes("profile")) {
      promises.push(
        linkedInService
          .getProfile()
          .then((data) => {
            results.profile = data;
          })
          .catch((error) => {
            results.profile = { error: error.message };
          })
      );
    }

    if (sections.includes("experience")) {
      promises.push(
        linkedInService
          .getPositions()
          .then((data) => {
            results.experience = data;
          })
          .catch((error) => {
            results.experience = { error: error.message };
          })
      );
    }

    if (sections.includes("education")) {
      promises.push(
        linkedInService
          .getEducation()
          .then((data) => {
            results.education = data;
          })
          .catch((error) => {
            results.education = { error: error.message };
          })
      );
    }

    if (sections.includes("skills")) {
      promises.push(
        linkedInService
          .getSkills()
          .then((data) => {
            results.skills = data;
          })
          .catch((error) => {
            results.skills = { error: error.message };
          })
      );
    }

    await Promise.all(promises);

    return NextResponse.json({
      success: true,
      data: results,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("LinkedIn selective fetch error:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to fetch LinkedIn data",
      },
      { status: 500 }
    );
  }
}
