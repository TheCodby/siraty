import { NextRequest, NextResponse } from "next/server";
import { sendChatMessage, OpenAIError } from "@/lib/openai";
import type { ChatMessage } from "@/types/ai";
import type { CVData } from "@/types/cv";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, cvData, language = "en" } = body;

    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Validate message format
    const isValidMessages = messages.every((msg: unknown) => {
      const message = msg as Record<string, unknown>;
      return (
        message.role &&
        message.content &&
        ["user", "assistant"].includes(message.role as string)
      );
    });

    if (!isValidMessages) {
      return NextResponse.json(
        { error: "Invalid message format" },
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

    const result = await sendChatMessage(
      messages as ChatMessage[],
      cvData as CVData | undefined,
      language as "en" | "ar"
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Chat API error:", error);

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

// Handle OPTIONS request for CORS
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
