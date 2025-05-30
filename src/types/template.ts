/**
 * Word Template System Types
 * Defines the structure for Word document templates and generation options
 */

export interface WordTemplate {
  id: string;
  name: string;
  description: string;
  category: "academic" | "professional" | "creative" | "modern";
  previewImage: string;
  wordFilePath: string; // Path to .docx template file in public folder
  isPremium: boolean;
  supportedLanguages: string[]; // ['en', 'ar']
  metadata: {
    author: string;
    version: string;
    lastUpdated: string;
    compatibility: string[]; // Word versions
  };
  placeholders: {
    personalInfo: string[];
    workExperience: string[];
    education: string[];
    skills: string[];
    projects: string[];
    custom: string[];
  };
}

export interface TemplateGenerationOptions {
  templateId: string;
  format: "pdf" | "docx" | "both";
  fileName?: string;
  language?: "en" | "ar";
  customizations?: {
    removeEmptySections?: boolean;
    includeReferences?: boolean;
    maxPages?: number;
  };
}

export interface GeneratedDocument {
  success: boolean;
  files: {
    docx?: {
      data: string; // base64 encoded
      filename: string;
      mimeType: string;
      size: number;
    };
    pdf?: {
      data: string; // base64 encoded
      filename: string;
      mimeType: string;
      size: number;
    };
  };
  metadata: {
    templateUsed: string;
    generatedAt: string;
    processingTime: number;
    conversionMethod?: string;
  };
  errors?: string[];
}

export interface TemplateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingPlaceholders: string[];
}

export interface DocumentProcessingProgress {
  stage: "parsing" | "filling" | "converting" | "complete" | "error";
  progress: number; // 0-100
  message: string;
  estimatedTimeRemaining?: number;
}
