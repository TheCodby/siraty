export type ScoreDetails = {
  score: number;
  feedback: string[];
};

export type KeywordScore = {
  score: number;
  matched: string[];
  missing: string[];
  feedback: string[];
};

export type SkillsMatchDetails = {
  matched: string[];
  missing: string[];
  percentage: number;
};

export type ExperienceMatchDetails = {
  relevant: boolean;
  yearsMatch: boolean;
  percentage: number;
};

export type EducationMatchDetails = {
  relevant: boolean;
  percentage: number;
};

export type ImprovementArea = {
  area: string;
  priority: "high" | "medium" | "low";
  suggestions: string[];
};

export type ATSScoreData = {
  cvId: string;
  overallScore: number;
  estimatedPassRate: number;
  formattingScore: ScoreDetails;
  keywordsScore: KeywordScore;
  experienceScore: ScoreDetails;
  educationScore: ScoreDetails;
  skillsScore: ScoreDetails;
  recommendations: string[];
};

export type JobMatchData = {
  cvId: string;
  jobId: string;
  overallMatch: number;
  skillsMatch: SkillsMatchDetails;
  experienceMatch: ExperienceMatchDetails;
  educationMatch: EducationMatchDetails;
  recommendations: string[];
  improvementAreas: ImprovementArea[];
};

export type ChatMessageMetadata = {
  type?: "cv_analysis" | "improvement_suggestion" | "jd_match";
  relatedSection?: string;
};

export type ChatMessageData = {
  sessionId: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
  contentType?: string;
  metadata?: ChatMessageMetadata;
  tokensUsed?: number;
  modelUsed?: string;
};

export type CreateCVData = {
  title: string;
  language: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
    portfolio?: string;
    summary: string;
  };
};
