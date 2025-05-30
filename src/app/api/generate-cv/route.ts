/**
 * CV Generation API Route
 * Handles Word template processing and PDF generation requests
 *
 * Best Practices Implemented:
 * - Input validation and sanitization
 * - Comprehensive error handling
 * - Rate limiting and security
 * - Performance monitoring
 * - Proper HTTP status codes
 * - Memory management
 */

import { NextRequest, NextResponse } from "next/server";
import { DocumentProcessor } from "@/lib/templates/document-processor";
import { PDFGenerator } from "@/lib/templates/pdf-generator";
import { getTemplateById } from "@/lib/templates/registry";
import { cvDataSchema } from "@/lib/validations/cv";
import type {
  CVData,
  TemplateGenerationOptions,
  GeneratedDocument,
} from "@/types";

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // Max 10 requests per minute per IP
const requestCounts = new Map<string, { count: number; resetTime: number }>();

interface GenerationRequest {
  cvData: CVData;
  options: TemplateGenerationOptions;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        {
          error:
            "Rate limit exceeded. Please wait before making another request.",
          retryAfter: 60,
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await parseRequestBody(request);
    const { cvData, options } = await validateGenerationRequest(body);

    // Get and validate template
    const template = getTemplateById(options.templateId);
    if (!template) {
      return NextResponse.json(
        { error: `Template not found: ${options.templateId}` },
        { status: 404 }
      );
    }

    // Check template compatibility
    const language = options.language || "en";
    if (!template.supportedLanguages.includes(language)) {
      return NextResponse.json(
        {
          error: `Template "${template.name}" doesn't support ${language} language`,
          supportedLanguages: template.supportedLanguages,
        },
        { status: 400 }
      );
    }

    // Initialize processors
    const documentProcessor = new DocumentProcessor();
    const pdfGenerator = new PDFGenerator();

    console.log(
      `Starting CV generation: Template=${template.id}, Format=${options.format}, Language=${language}`
    );

    // Generate Word document
    const wordBuffer = await documentProcessor.fillTemplate(
      template,
      cvData,
      language
    );

    let pdfBuffer: Buffer | undefined;
    let conversionMethod: string | undefined;

    // Generate PDF if requested
    if (options.format === "pdf" || options.format === "both") {
      try {
        const pdfResult = await pdfGenerator.convertWordToPDF(wordBuffer, {
          format: "A4",
          timeout: 30000,
        });

        if (pdfResult.success && pdfResult.buffer) {
          pdfBuffer = pdfResult.buffer;
          conversionMethod = pdfResult.method;
          console.log(
            `PDF conversion successful using ${pdfResult.method} in ${pdfResult.processingTime}ms`
          );
        } else {
          console.warn("PDF conversion failed, continuing with Word-only");
        }
      } catch (error) {
        console.error("PDF conversion error:", error);
        // Continue without PDF if conversion fails
      }
    }

    // Prepare response based on format
    const fileName =
      options.fileName ||
      `cv-${template.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;

    const processingTime = Date.now() - startTime;

    // Single format responses (direct file download)
    if (options.format === "pdf" && pdfBuffer) {
      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${fileName}.pdf"`,
          "Content-Length": pdfBuffer.length.toString(),
          "X-Processing-Time": processingTime.toString(),
          "X-Conversion-Method": conversionMethod || "unknown",
        },
      });
    }

    if (options.format === "docx") {
      return new NextResponse(wordBuffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${fileName}.docx"`,
          "Content-Length": wordBuffer.length.toString(),
          "X-Processing-Time": processingTime.toString(),
        },
      });
    }

    // Both formats response (JSON with base64 encoded files)
    if (options.format === "both") {
      const response: GeneratedDocument = {
        success: true,
        files: {
          docx: {
            data: wordBuffer.toString("base64"),
            filename: `${fileName}.docx`,
            mimeType:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            size: wordBuffer.length,
          },
        },
        metadata: {
          templateUsed: template.id,
          generatedAt: new Date().toISOString(),
          processingTime,
        },
      };

      // Add PDF if available
      if (pdfBuffer) {
        response.files.pdf = {
          data: pdfBuffer.toString("base64"),
          filename: `${fileName}.pdf`,
          mimeType: "application/pdf",
          size: pdfBuffer.length,
        };
        response.metadata.conversionMethod = conversionMethod;
      } else {
        response.errors = [
          "PDF conversion failed - only Word document available",
        ];
      }

      return NextResponse.json(response, {
        headers: {
          "X-Processing-Time": processingTime.toString(),
        },
      });
    }

    // Fallback - should not reach here
    return NextResponse.json(
      { error: "Invalid format specified" },
      { status: 400 }
    );
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error("CV generation error:", error);

    // Determine appropriate error response
    if (error instanceof Error) {
      if (error.message.includes("Validation failed")) {
        return NextResponse.json(
          {
            error: "Invalid CV data",
            details: error.message,
            processingTime,
          },
          { status: 400 }
        );
      }

      if (error.message.includes("Template file not found")) {
        return NextResponse.json(
          {
            error: "Template file not found",
            details: error.message,
            processingTime,
          },
          { status: 404 }
        );
      }

      if (error.message.includes("File too large")) {
        return NextResponse.json(
          {
            error: "File size limit exceeded",
            details: error.message,
            processingTime,
          },
          { status: 413 }
        );
      }
    }

    // Generic server error
    return NextResponse.json(
      {
        error: "Failed to generate CV",
        message: "An unexpected error occurred during CV generation",
        processingTime,
      },
      { status: 500 }
    );
  }
}

/**
 * Utility functions
 */

async function parseRequestBody(request: NextRequest): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new Error("Invalid JSON in request body");
  }
}

async function validateGenerationRequest(
  body: unknown
): Promise<GenerationRequest> {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be an object");
  }

  const { cvData, options } = body as Record<string, unknown>;

  // Validate CV data
  if (!cvData) {
    throw new Error("Missing cvData in request");
  }

  try {
    const validatedCVData = cvDataSchema.parse(cvData);

    // Validate options
    if (!options || typeof options !== "object") {
      throw new Error("Missing or invalid options in request");
    }

    const validatedOptions = validateTemplateOptions(
      options as Record<string, unknown>
    );

    return {
      cvData: validatedCVData as CVData,
      options: validatedOptions,
    };
  } catch (error) {
    throw new Error(
      `Validation failed: ${
        error instanceof Error ? error.message : "Unknown validation error"
      }`
    );
  }
}

function validateTemplateOptions(
  options: Record<string, unknown>
): TemplateGenerationOptions {
  const { templateId, format, fileName, language, customizations } = options;

  if (!templateId || typeof templateId !== "string") {
    throw new Error("templateId is required and must be a string");
  }

  if (!format || !["pdf", "docx", "both"].includes(format as string)) {
    throw new Error("format must be one of: pdf, docx, both");
  }

  const validated: TemplateGenerationOptions = {
    templateId: templateId as string,
    format: format as "pdf" | "docx" | "both",
  };

  if (fileName && typeof fileName === "string") {
    // Sanitize filename
    validated.fileName = fileName
      .replace(/[^a-zA-Z0-9-_]/g, "")
      .substring(0, 50);
  }

  if (language && ["en", "ar"].includes(language as string)) {
    validated.language = language as "en" | "ar";
  }

  if (customizations && typeof customizations === "object") {
    validated.customizations =
      customizations as TemplateGenerationOptions["customizations"];
  }

  return validated;
}

function getClientIP(request: NextRequest): string {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  const xRealIP = request.headers.get("x-real-ip");

  return xForwardedFor?.split(",")[0]?.trim() || xRealIP || "unknown";
}

function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const clientData = requestCounts.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    // New client or window expired
    requestCounts.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    // Rate limit exceeded
    return false;
  }

  // Increment count
  clientData.count++;
  requestCounts.set(clientIP, clientData);
  return true;
}

// Cleanup old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestCounts.entries()) {
    if (now > data.resetTime) {
      requestCounts.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW);
