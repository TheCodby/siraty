import { NextRequest, NextResponse } from "next/server";
import { scoreCV, OpenAIError } from "@/lib/openai";
import type { CVData } from "@/types/cv";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cvData, language = "en" } = body;

    // Validate required fields
    if (!cvData) {
      return NextResponse.json(
        { error: "CV data is required" },
        { status: 400 }
      );
    }

    // Basic validation of CV data structure
    if (typeof cvData !== "object" || !cvData.personalInfo) {
      return NextResponse.json(
        { error: "Invalid CV data format" },
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

    const result = await scoreCV(cvData as CVData, language as "en" | "ar");

    return NextResponse.json(result);
  } catch (error) {
    console.error("ATS Score API error:", error);

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
