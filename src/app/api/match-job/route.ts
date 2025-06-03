import { NextRequest, NextResponse } from "next/server";
import { matchCVWithJob, OpenAIError } from "@/lib/openai";
import type { CVData } from "@/types/cv";
import type { JobDescription } from "@/types/job";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cvData, jobDescription, language = "en" } = body;

    // Validate required fields
    if (!cvData) {
      return NextResponse.json(
        { error: "CV data is required" },
        { status: 400 }
      );
    }

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    // Basic validation of data structures
    if (typeof cvData !== "object" || !cvData.personalInfo) {
      return NextResponse.json(
        { error: "Invalid CV data format" },
        { status: 400 }
      );
    }

    if (typeof jobDescription !== "object" || !jobDescription.title) {
      return NextResponse.json(
        { error: "Invalid job description format" },
        { status: 400 }
      );
    }

    // Validate language
    if (!["en", "ar"].includes(language)) {
      return NextResponse.json(
        { error: 'Language must be either "en" or "ar"' },
        { status: 400 }
      );
    }

    const result = await matchCVWithJob(
      cvData as CVData,
      jobDescription as JobDescription,
      language as "en" | "ar"
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Job Match API error:", error);

    if (error instanceof OpenAIError) {
      const statusCode = error.code === "RATE_LIMIT" ? 429 : 500;
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
