/**
 * Template Registry
 * Central registry for all available Word templates with metadata and configuration
 */

import type { WordTemplate } from "@/types/template";

export const WORD_TEMPLATES: WordTemplate[] = [
  {
    id: "harvard-classic",
    name: "Harvard Classic",
    description: "Traditional academic format used by Harvard Business School",
    category: "academic",
    previewImage: "/templates/previews/harvard-classic.jpg",
    wordFilePath: "templates/word/harvard-classic.docx",
    isPremium: false,
    supportedLanguages: ["en", "ar"],
    metadata: {
      author: "CV Builder Team",
      version: "1.0.0",
      lastUpdated: "2024-01-15",
      compatibility: ["Word 2016+", "LibreOffice 6+"],
    },
    placeholders: {
      personalInfo: [
        "{{FULL_NAME}}",
        "{{EMAIL}}",
        "{{PHONE}}",
        "{{LOCATION}}",
        "{{LINKEDIN}}",
        "{{PORTFOLIO}}",
        "{{SUMMARY}}",
      ],
      workExperience: [
        "{{#WORK_EXPERIENCE}}",
        "{{JOB_TITLE}}",
        "{{COMPANY}}",
        "{{LOCATION}}",
        "{{START_DATE}}",
        "{{END_DATE}}",
        "{{DESCRIPTION}}",
        "{{ACHIEVEMENTS}}",
        "{{/WORK_EXPERIENCE}}",
      ],
      education: [
        "{{#EDUCATION}}",
        "{{DEGREE}}",
        "{{INSTITUTION}}",
        "{{GRADUATION_DATE}}",
        "{{GPA}}",
        "{{HONORS}}",
        "{{/EDUCATION}}",
      ],
      skills: ["{{TECHNICAL_SKILLS}}", "{{SOFT_SKILLS}}", "{{LANGUAGES}}"],
      projects: [
        "{{#PROJECTS}}",
        "{{PROJECT_NAME}}",
        "{{PROJECT_DESCRIPTION}}",
        "{{TECHNOLOGIES}}",
        "{{/PROJECTS}}",
      ],
      custom: [],
    },
  },
];

/**
 * Utility functions for template management
 */

export const getTemplateById = (id: string): WordTemplate | undefined => {
  return WORD_TEMPLATES.find((template) => template.id === id);
};

export const getTemplatesByCategory = (
  category: WordTemplate["category"]
): WordTemplate[] => {
  return WORD_TEMPLATES.filter((template) => template.category === category);
};

export const getFreeTemplates = (): WordTemplate[] => {
  return WORD_TEMPLATES.filter((template) => !template.isPremium);
};

export const getPremiumTemplates = (): WordTemplate[] => {
  return WORD_TEMPLATES.filter((template) => template.isPremium);
};

export const getTemplatesByLanguage = (language: string): WordTemplate[] => {
  return WORD_TEMPLATES.filter((template) =>
    template.supportedLanguages.includes(language)
  );
};

export const validateTemplateCompatibility = (
  templateId: string,
  userRequirements: {
    language?: string;
    isPremiumUser?: boolean;
  }
): { compatible: boolean; reasons: string[] } => {
  const template = getTemplateById(templateId);

  if (!template) {
    return { compatible: false, reasons: ["Template not found"] };
  }

  const reasons: string[] = [];

  // Check premium access
  if (template.isPremium && !userRequirements.isPremiumUser) {
    reasons.push("Premium template requires premium subscription");
  }

  // Check language support
  if (
    userRequirements.language &&
    !template.supportedLanguages.includes(userRequirements.language)
  ) {
    reasons.push(
      `Template doesn't support ${userRequirements.language} language`
    );
  }

  return {
    compatible: reasons.length === 0,
    reasons,
  };
};

export const getRecommendedTemplates = (userProfile: {
  industry?: string;
  experience?: "entry" | "mid" | "senior";
  isPremiumUser?: boolean;
}): WordTemplate[] => {
  const { industry, isPremiumUser } = userProfile;

  let recommendations = [...WORD_TEMPLATES];

  // Filter by premium access
  if (!isPremiumUser) {
    recommendations = recommendations.filter((template) => !template.isPremium);
  }

  // Industry-based recommendations
  if (industry) {
    switch (industry) {
      case "technology":
      case "software":
        recommendations.sort((a, b) => {
          const techOrder = [
            "modern-professional",
            "minimalist-clean",
            "harvard-classic",
          ];
          return techOrder.indexOf(a.id) - techOrder.indexOf(b.id);
        });
        break;
      case "creative":
      case "design":
        recommendations.sort((a, b) => {
          const creativeOrder = [
            "creative-portfolio",
            "modern-professional",
            "minimalist-clean",
          ];
          return creativeOrder.indexOf(a.id) - creativeOrder.indexOf(b.id);
        });
        break;
      case "academic":
      case "research":
        recommendations.sort((a, b) => {
          const academicOrder = [
            "harvard-classic",
            "minimalist-clean",
            "modern-professional",
          ];
          return academicOrder.indexOf(a.id) - academicOrder.indexOf(b.id);
        });
        break;
    }
  }

  return recommendations.slice(0, 4); // Return top 4 recommendations
};
