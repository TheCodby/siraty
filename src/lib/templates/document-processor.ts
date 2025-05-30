/**
 * Document Processing Service
 * Handles Word template processing, data injection, and document generation
 *
 * Best Practices Implemented:
 * - Comprehensive error handling and logging
 * - Type safety with TypeScript
 * - Async/await for better performance
 * - Input validation and sanitization
 * - Memory management for large documents
 * - Support for RTL languages (Arabic)
 */

import { promises as fs } from "fs";
import * as path from "path";
import type {
  CVData,
  WordTemplate,
  TemplateValidationResult,
  Skill,
  WorkExperience,
  Education,
  Project,
} from "@/types";

export class DocumentProcessor {
  private readonly tempDir: string;
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB limit

  constructor() {
    this.tempDir = path.join(process.cwd(), "temp", "documents");
    this.ensureTempDirectory();
  }

  /**
   * Fill Word template with CV data using docx-templates
   */
  async fillTemplate(
    template: WordTemplate,
    cvData: CVData,
    language: "en" | "ar" = "en"
  ): Promise<Buffer> {
    const startTime = Date.now();

    try {
      // Validate inputs
      await this.validateInputs(template, cvData);

      // Read the Word template file
      const templateBuffer = await this.readTemplateFile(template.wordFilePath);

      // Prepare data for template injection
      const templateData = await this.prepareCVDataForTemplate(
        cvData,
        template,
        language
      );

      // Use docx-templates to fill the template
      const { createReport } = await this.importDocxTemplates();

      const filledDocument = await createReport({
        template: templateBuffer,
        data: templateData,
        cmdDelimiter: ["{{", "}}"],
        literalXmlDelimiter: "{{{",
        processLineBreaks: true,
        noSandbox: false, // Security: keep sandbox enabled
        additionalJsContext: {
          // Add utility functions for templates
          formatDate: this.formatDate,
          formatList: this.formatList,
          truncate: this.truncate,
        },
      });

      const processingTime = Date.now() - startTime;
      console.log(`Template processing completed in ${processingTime}ms`);

      return Buffer.from(filledDocument);
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error(
        `Template processing failed after ${processingTime}ms:`,
        error
      );

      throw new Error(
        `Failed to process template: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Validate template and CV data before processing
   */
  async validateInputs(
    template: WordTemplate,
    cvData: CVData
  ): Promise<TemplateValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingPlaceholders: string[] = [];

    // Check if template file exists
    const templatePath = path.join(
      process.cwd(),
      "public",
      template.wordFilePath
    );
    try {
      const stats = await fs.stat(templatePath);
      if (stats.size > this.maxFileSize) {
        errors.push(
          `Template file too large: ${stats.size} bytes (max: ${this.maxFileSize})`
        );
      }
    } catch {
      errors.push(`Template file not found: ${template.wordFilePath}`);
    }

    // Validate required CV data
    if (!cvData.personalInfo.fullName?.trim()) {
      errors.push("Full name is required");
    }

    if (!cvData.personalInfo.email?.trim()) {
      errors.push("Email is required");
    }

    // Check for common missing data that might affect template quality
    if (cvData.workExperience.length === 0) {
      warnings.push(
        "No work experience provided - template may appear incomplete"
      );
    }

    if (cvData.skills.length === 0) {
      warnings.push("No skills provided - template may appear incomplete");
    }

    const result: TemplateValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings,
      missingPlaceholders,
    };

    if (!result.isValid) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }

    return result;
  }

  /**
   * Convert CV data to template-friendly format with proper formatting
   */
  private async prepareCVDataForTemplate(
    cvData: CVData,
    template: WordTemplate,
    language: "en" | "ar"
  ) {
    const { personalInfo, workExperience, education, skills, projects } =
      cvData;

    return {
      // Personal Information
      FULL_NAME: this.sanitizeText(personalInfo.fullName || ""),
      EMAIL: this.sanitizeText(personalInfo.email || ""),
      PHONE: this.sanitizeText(personalInfo.phone || ""),
      LOCATION: this.sanitizeText(personalInfo.location || ""),
      LINKEDIN: this.sanitizeText(personalInfo.linkedIn || ""),
      PORTFOLIO: this.sanitizeText(personalInfo.portfolio || ""),
      SUMMARY: this.sanitizeText(personalInfo.summary || ""),

      // Contact info combined (for minimal templates)
      CONTACT_INFO: [
        personalInfo.email,
        personalInfo.phone,
        personalInfo.location,
      ]
        .filter(Boolean)
        .join(" | "),

      // Work Experience
      WORK_EXPERIENCE: workExperience.map((exp) => ({
        JOB_TITLE: this.sanitizeText(exp.jobTitle),
        COMPANY: this.sanitizeText(exp.company),
        LOCATION: this.sanitizeText(exp.location),
        START_DATE: this.formatDate(exp.startDate, language),
        END_DATE: exp.endDate
          ? this.formatDate(exp.endDate, language)
          : language === "ar"
          ? "حتى الآن"
          : "Present",
        DESCRIPTION: this.sanitizeText(exp.description),
        ACHIEVEMENTS: this.formatAchievements(exp.achievements || [], language),
        TECHNOLOGIES: this.formatList(exp.technologies || []),
        DURATION: this.calculateDuration(exp.startDate, exp.endDate, language),
      })),

      // Education
      EDUCATION: education.map((edu) => ({
        DEGREE: this.sanitizeText(edu.degree),
        INSTITUTION: this.sanitizeText(edu.institution),
        LOCATION: this.sanitizeText(edu.location),
        GRADUATION_DATE: this.formatDate(edu.graduationDate, language),
        GPA: edu.gpa || "",
        HONORS: this.formatList(edu.honors || []),
        RELEVANT_COURSES: this.formatList(edu.relevantCourses || []),
      })),

      // Skills categorized
      TECHNICAL_SKILLS: this.formatSkillsByCategory(
        skills,
        "technical",
        language
      ),
      SOFT_SKILLS: this.formatSkillsByCategory(skills, "soft", language),
      LANGUAGES: this.formatSkillsByCategory(skills, "language", language),

      // Projects
      PROJECTS: projects.map((project) => ({
        PROJECT_NAME: this.sanitizeText(project.name),
        PROJECT_DESCRIPTION: this.sanitizeText(project.description),
        TECHNOLOGIES: this.formatList(project.technologies),
        START_DATE: this.formatDate(project.startDate, language),
        END_DATE: project.endDate
          ? this.formatDate(project.endDate, language)
          : "",
        LINK: project.link || "",
        REPOSITORY: project.repository || "",
      })),

      // Formatted sections (for complex templates)
      WORK_SECTION: this.formatWorkExperienceSection(workExperience, language),
      EDUCATION_SECTION: this.formatEducationSection(education, language),
      SKILLS_GRID: this.formatSkillsGrid(skills, language),
      PROJECTS_SHOWCASE: this.formatProjectsSection(projects, language),

      // Counts and metadata
      WORK_EXPERIENCE_COUNT: workExperience.length,
      EDUCATION_COUNT: education.length,
      SKILLS_COUNT: skills.length,
      PROJECTS_COUNT: projects.length,
      TOTAL_EXPERIENCE_YEARS: this.calculateTotalExperience(workExperience),

      // Language-specific content
      LANGUAGE: language,
      TEXT_DIRECTION: language === "ar" ? "rtl" : "ltr",
    };
  }

  /**
   * Utility functions for data formatting
   */
  private sanitizeText(text: string): string {
    return text
      .replace(/[<>]/g, "") // Remove potential XML characters
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();
  }

  private formatDate(dateString: string, language: "en" | "ar"): string {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      if (language === "ar") {
        return date.toLocaleDateString("ar-SA", {
          year: "numeric",
          month: "long",
        });
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    } catch {
      return dateString; // Return original if parsing fails
    }
  }

  private formatList(items: string[]): string {
    return items.filter(Boolean).join(" • ");
  }

  private formatAchievements(
    achievements: string[],
    language: "en" | "ar"
  ): string {
    if (achievements.length === 0) return "";

    const bullet = language === "ar" ? "•" : "•";
    return achievements
      .filter(Boolean)
      .map((achievement) => `${bullet} ${this.sanitizeText(achievement)}`)
      .join("\n");
  }

  private formatSkillsByCategory(
    skills: Skill[],
    category: string,
    language: "en" | "ar"
  ): string {
    const categorySkills = skills.filter(
      (skill) => skill.category === category
    );
    return categorySkills
      .map(
        (skill) =>
          `${skill.name} (${this.translateSkillLevel(skill.level, language)})`
      )
      .join(" • ");
  }

  private translateSkillLevel(level: string, language: "en" | "ar"): string {
    if (language === "ar") {
      const translations: Record<string, string> = {
        beginner: "مبتدئ",
        intermediate: "متوسط",
        advanced: "متقدم",
        expert: "خبير",
      };
      return translations[level] || level;
    }
    return level.charAt(0).toUpperCase() + level.slice(1);
  }

  private calculateDuration(
    startDate: string,
    endDate?: string,
    language: "en" | "ar" = "en"
  ): string {
    try {
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : new Date();

      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());

      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;

      if (language === "ar") {
        if (years > 0 && remainingMonths > 0) {
          return `${years} سنة ${remainingMonths} شهر`;
        } else if (years > 0) {
          return `${years} سنة`;
        } else {
          return `${remainingMonths} شهر`;
        }
      } else {
        if (years > 0 && remainingMonths > 0) {
          return `${years} year${
            years > 1 ? "s" : ""
          } ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
        } else if (years > 0) {
          return `${years} year${years > 1 ? "s" : ""}`;
        } else {
          return `${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
        }
      }
    } catch {
      return "";
    }
  }

  private calculateTotalExperience(workExperience: WorkExperience[]): number {
    return workExperience.reduce((total, exp) => {
      const duration = this.calculateDuration(exp.startDate, exp.endDate);
      const years = parseFloat(
        duration.match(/(\d+(?:\.\d+)?)\s*year/)?.[1] || "0"
      );
      return total + years;
    }, 0);
  }

  private formatWorkExperienceSection(
    workExperience: WorkExperience[],
    language: "en" | "ar"
  ): string {
    return workExperience
      .map((exp) => {
        const duration = this.calculateDuration(
          exp.startDate,
          exp.endDate,
          language
        );
        return [
          `${exp.jobTitle} | ${exp.company}`,
          `${this.formatDate(exp.startDate, language)} - ${
            exp.endDate
              ? this.formatDate(exp.endDate, language)
              : language === "ar"
              ? "حتى الآن"
              : "Present"
          } (${duration})`,
          exp.location,
          exp.description,
          exp.achievements?.length
            ? this.formatAchievements(exp.achievements, language)
            : "",
          "",
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n");
  }

  private formatEducationSection(
    education: Education[],
    language: "en" | "ar"
  ): string {
    return education
      .map((edu) =>
        [
          `${edu.degree} | ${edu.institution}`,
          `${this.formatDate(edu.graduationDate, language)} | ${edu.location}`,
          edu.gpa ? `GPA: ${edu.gpa}` : "",
          edu.honors?.length ? `Honors: ${this.formatList(edu.honors)}` : "",
          "",
        ]
          .filter(Boolean)
          .join("\n")
      )
      .join("\n");
  }

  private formatSkillsGrid(skills: Skill[], language: "en" | "ar"): string {
    const categories = ["technical", "soft", "language"];
    return categories
      .map((category) => {
        const categorySkills = skills.filter(
          (skill) => skill.category === category
        );
        if (categorySkills.length === 0) return "";

        const categoryName =
          language === "ar"
            ? {
                technical: "المهارات التقنية",
                soft: "المهارات الشخصية",
                language: "اللغات",
              }[category]
            : category.charAt(0).toUpperCase() + category.slice(1);

        return `${categoryName}:\n${this.formatSkillsByCategory(
          skills,
          category,
          language
        )}`;
      })
      .filter(Boolean)
      .join("\n\n");
  }

  private formatProjectsSection(
    projects: Project[],
    language: "en" | "ar"
  ): string {
    return projects
      .map((project) =>
        [
          `${project.name} | ${this.formatDate(project.startDate, language)}`,
          project.description,
          `Technologies: ${this.formatList(project.technologies)}`,
          project.link ? `Demo: ${project.link}` : "",
          project.repository ? `Repository: ${project.repository}` : "",
          "",
        ]
          .filter(Boolean)
          .join("\n")
      )
      .join("\n");
  }

  private truncate(text: string, length: number = 100): string {
    return text.length > length ? text.substring(0, length) + "..." : text;
  }

  /**
   * Utility functions for file operations
   */
  private async readTemplateFile(templatePath: string): Promise<Buffer> {
    try {
      const fullPath = path.join(process.cwd(), "src", templatePath);
      return await fs.readFile(fullPath);
    } catch {
      throw new Error(`Failed to read template file: ${templatePath}`);
    }
  }

  private async ensureTempDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch {
      console.warn("Could not create temp directory");
    }
  }

  private async importDocxTemplates() {
    try {
      return await import("docx-templates");
    } catch {
      throw new Error(
        "docx-templates package not available. Please install it: npm install docx-templates"
      );
    }
  }
}
