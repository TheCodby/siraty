import type { CVData } from "./cv";

export interface ATSScore {
  overall: number;
  categories: {
    formatting: {
      score: number;
      feedback: string[];
    };
    keywords: {
      score: number;
      matched: string[];
      missing: string[];
      feedback: string[];
    };
    experience: {
      score: number;
      feedback: string[];
    };
    education: {
      score: number;
      feedback: string[];
    };
    skills: {
      score: number;
      feedback: string[];
    };
  };
  recommendations: string[];
  estimatedPassRate: number;
}

export interface MatchAnalysis {
  overallMatch: number;
  skillsMatch: {
    matched: string[];
    missing: string[];
    percentage: number;
  };
  experienceMatch: {
    relevant: boolean;
    yearsMatch: boolean;
    percentage: number;
  };
  educationMatch: {
    relevant: boolean;
    percentage: number;
  };
  recommendations: string[];
  improvementAreas: Array<{
    area: string;
    priority: "high" | "medium" | "low";
    suggestions: string[];
  }>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  metadata?: {
    type?: "cv_analysis" | "improvement_suggestion" | "jd_match";
    relatedSection?: keyof CVData;
  };
}
