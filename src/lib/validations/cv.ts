import { z } from "zod";

// Personal Information Schema
export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),

  location: z
    .string()
    .min(1, "Location is required")
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be less than 100 characters"),

  linkedIn: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        return /^https:\/\/(www\.)?linkedin\.com\/in\/[\w\-_]+\/?$/.test(value);
      },
      { message: "Please enter a valid LinkedIn URL" }
    ),

  portfolio: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        return /^https?:\/\/.+\..+/.test(value);
      },
      { message: "Please enter a valid URL" }
    ),

  summary: z
    .string()
    .min(1, "Professional summary is required")
    .min(50, "Summary should be at least 50 characters")
    .max(500, "Summary must be less than 500 characters"),
});

// Work Experience Schema
export const workExperienceSchema = z
  .object({
    id: z.string(),

    jobTitle: z
      .string()
      .min(1, "Job title is required")
      .min(2, "Job title must be at least 2 characters")
      .max(100, "Job title must be less than 100 characters"),

    company: z
      .string()
      .min(1, "Company name is required")
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name must be less than 100 characters"),

    location: z
      .string()
      .min(1, "Location is required")
      .min(2, "Location must be at least 2 characters")
      .max(100, "Location must be less than 100 characters"),

    startDate: z
      .string()
      .min(1, "Start date is required")
      .regex(
        /^(January|February|March|April|May|June|July|August|September|October|November|December)\s\d{4}$|^\d{4}$|^\d{1,2}\/\d{4}$/,
        "Please enter a valid date format (e.g., 'January 2023', '2023', '01/2023')"
      ),

    endDate: z.string().optional(),

    isCurrentRole: z.boolean(),

    description: z
      .string()
      .min(1, "Job description is required")
      .min(50, "Description should be at least 50 characters")
      .max(1000, "Description must be less than 1000 characters"),

    achievements: z.array(z.string()).default([]),
    technologies: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (!data.isCurrentRole && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required for past roles",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      if (data.isCurrentRole || !data.endDate) return true;

      const startYear = parseInt(data.startDate.match(/\d{4}/)?.[0] || "0");
      const endYear = parseInt(data.endDate.match(/\d{4}/)?.[0] || "0");

      return endYear >= startYear;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

// Education Schema
export const educationSchema = z.object({
  id: z.string(),

  degree: z
    .string()
    .min(1, "Degree/Qualification is required")
    .min(2, "Degree must be at least 2 characters")
    .max(150, "Degree must be less than 150 characters"),

  institution: z
    .string()
    .min(1, "Institution name is required")
    .min(2, "Institution name must be at least 2 characters")
    .max(150, "Institution name must be less than 150 characters"),

  location: z
    .string()
    .min(1, "Location is required")
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be less than 100 characters"),

  graduationDate: z
    .string()
    .min(1, "Graduation date is required")
    .regex(
      /^(January|February|March|April|May|June|July|August|September|October|November|December)\s\d{4}$|^\d{4}$|^\d{1,2}\/\d{4}$/,
      "Please enter a valid date format (e.g., 'May 2020', '2020', '05/2020')"
    ),

  gpa: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        return /^\d+(\.\d+)?\/\d+(\.\d+)?$|^\d+(\.\d+)?$/.test(value);
      },
      { message: "Please enter a valid GPA format (e.g., '3.8/4.0' or '3.8')" }
    ),

  honors: z.array(z.string()).optional(),
  relevantCourses: z.array(z.string()).optional(),
});

// Skill Schema
export const skillSchema = z.object({
  id: z.string(),

  name: z
    .string()
    .min(1, "Skill name is required")
    .min(2, "Skill name must be at least 2 characters")
    .max(50, "Skill name must be less than 50 characters"),

  level: z.enum(["beginner", "intermediate", "advanced", "expert"], {
    required_error: "Skill level is required",
    invalid_type_error: "Please select a valid skill level",
  }),

  category: z.enum(["technical", "soft", "language"], {
    required_error: "Skill category is required",
    invalid_type_error: "Please select a valid skill category",
  }),
});

// Project Schema
export const projectSchema = z.object({
  id: z.string(),

  name: z
    .string()
    .min(1, "Project name is required")
    .min(2, "Project name must be at least 2 characters")
    .max(100, "Project name must be less than 100 characters"),

  description: z
    .string()
    .min(1, "Project description is required")
    .min(50, "Description should be at least 50 characters")
    .max(1000, "Description must be less than 1000 characters"),

  technologies: z
    .array(z.string())
    .min(1, "At least one technology is required")
    .max(20, "Maximum 20 technologies allowed"),

  startDate: z
    .string()
    .regex(
      /^(January|February|March|April|May|June|July|August|September|October|November|December)\s\d{4}$|^\d{4}$|^\d{1,2}\/\d{4}$|^.+$/,
      "Please enter a valid date or duration format"
    )
    .optional(),

  endDate: z.string().optional(),

  link: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        return /^https?:\/\/.+\..+/.test(value);
      },
      { message: "Please enter a valid URL" }
    ),

  repository: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        return /^https:\/\/(www\.)?(github|gitlab|bitbucket)\.com\/.+/.test(
          value
        );
      },
      { message: "Please enter a valid repository URL" }
    ),
});

// Array schemas for validation
export const workExperienceArraySchema = z
  .array(workExperienceSchema)
  .min(1, "At least one work experience is required");

export const educationArraySchema = z
  .array(educationSchema)
  .min(1, "At least one education entry is required");

export const skillsArraySchema = z
  .array(skillSchema)
  .min(1, "At least one skill is required");

export const projectsArraySchema = z.array(projectSchema).optional();

// Complete CV Data Schema
export const cvDataSchema = z.object({
  id: z.string(),
  personalInfo: personalInfoSchema,
  workExperience: workExperienceArraySchema,
  education: educationArraySchema,
  skills: skillsArraySchema,
  projects: projectsArraySchema.default([]),
  certifications: z.array(z.any()).default([]),
  languages: z.array(z.any()).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Helper function to get field-specific errors
export const getFieldErrors = (
  error: z.ZodError,
  fieldPath: string
): string | undefined => {
  const fieldError = error.errors.find(
    (err) => err.path.join(".") === fieldPath
  );
  return fieldError?.message;
};

// Helper function to get all errors for an object
export const getObjectErrors = (
  error: z.ZodError,
  objectIndex?: number
): Record<string, string> => {
  const errors: Record<string, string> = {};

  error.errors.forEach((err) => {
    const path = err.path;
    if (objectIndex !== undefined) {
      // For array items, check if the error belongs to this index
      if (path[0] === objectIndex) {
        const fieldName = path[1] as string;
        if (fieldName) {
          errors[fieldName] = err.message;
        }
      }
    } else {
      // For simple objects, use the full path
      const fieldName = path[path.length - 1] as string;
      if (fieldName) {
        errors[fieldName] = err.message;
      }
    }
  });

  return errors;
};

// Helper function to validate individual fields for real-time feedback
export const validateField = <T>(
  schema: z.ZodSchema<T>,
  data: T,
  fieldName: string
): string | undefined => {
  try {
    schema.parse(data);
    return undefined;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldError = error.errors.find(
        (err) =>
          err.path.join(".") === fieldName ||
          err.path[err.path.length - 1] === fieldName
      );
      return fieldError?.message;
    }
    return undefined;
  }
};

// Re-export Zod for convenience
export { z } from "zod";
