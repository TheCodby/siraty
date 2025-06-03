import OpenAI from "openai";
import type { ChatMessage, ATSScore, MatchAnalysis } from "@/types/ai";
import type { CVData } from "@/types/cv";
import type { JobDescription } from "@/types/job";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  organization: process.env.OPENAI_ORGANIZATION_ID,
});

// Configuration
const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const DEFAULT_MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || "4096");

// Rate limiting tracker (simple in-memory store)
const rateLimitTracker = new Map<
  string,
  { count: number; resetTime: number }
>();

export class OpenAIError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "OpenAIError";
  }
}

// Rate limiting helper
const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const limit = parseInt(process.env.OPENAI_REQUESTS_PER_MINUTE || "60");
  const windowMs = 60 * 1000; // 1 minute

  const record = rateLimitTracker.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitTracker.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
};

// Generic OpenAI API call wrapper
const makeOpenAICall = async (
  messages: OpenAI.ChatCompletionMessageParam[],
  systemPrompt: string,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    responseFormat?: "text" | "json";
  } = {}
): Promise<string> => {
  try {
    const {
      model = DEFAULT_MODEL,
      maxTokens = DEFAULT_MAX_TOKENS,
      temperature = 0.7,
      responseFormat = "text",
    } = options;

    const allMessages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const response = await openai.chat.completions.create({
      model,
      messages: allMessages,
      max_tokens: maxTokens,
      temperature,
      ...(responseFormat === "json" && {
        response_format: { type: "json_object" },
      }),
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new OpenAIError("Empty response from OpenAI");
    }

    return content;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      throw new OpenAIError(
        error.message,
        error.code ?? undefined,
        error.status
      );
    }
    throw new OpenAIError(
      error instanceof Error ? error.message : "Unknown OpenAI error"
    );
  }
};

// CV Improvement Chat
export const sendChatMessage = async (
  messages: ChatMessage[],
  cvData?: CVData,
  language: "en" | "ar" = "en"
): Promise<{ response: string; usage?: OpenAI.CompletionUsage }> => {
  const identifier = `chat_${Date.now()}`;

  if (!checkRateLimit(identifier)) {
    throw new OpenAIError(
      "Rate limit exceeded. Please try again later.",
      "RATE_LIMIT"
    );
  }

  const systemPrompt =
    language === "ar"
      ? `أنت مساعد ذكي متخصص في تطوير السير الذاتية وتقديم المشورة المهنية. 
       ساعد المستخدم في تحسين سيرته الذاتية بنصائح عملية ومحددة.
       ${
         cvData
           ? `بيانات السيرة الذاتية الحالية: ${JSON.stringify(cvData)}`
           : ""
       }
       رد بالعربية واستخدم نبرة مهنية وودودة.`
      : `You are an AI career coach and CV expert. Help users improve their resumes with specific, actionable advice.
       ${cvData ? `Current CV data: ${JSON.stringify(cvData)}` : ""}
       Provide professional, friendly guidance in English.`;

  const openaiMessages: OpenAI.ChatCompletionMessageParam[] = messages.map(
    (msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    })
  );

  const response = await makeOpenAICall(openaiMessages, systemPrompt, {
    temperature: 0.8,
    maxTokens: 1500,
  });

  return { response };
};

// ATS Scoring
export const scoreCV = async (
  cvData: CVData,
  language: "en" | "ar" = "en"
): Promise<ATSScore> => {
  const identifier = `ats_${Date.now()}`;

  if (!checkRateLimit(identifier)) {
    throw new OpenAIError(
      "Rate limit exceeded. Please try again later.",
      "RATE_LIMIT"
    );
  }

  const systemPrompt =
    language === "ar"
      ? `أنت خبير في أنظمة تتبع المتقدمين (ATS). قم بتحليل السيرة الذاتية وإعطاء نتيجة شاملة من 0-100 لكل فئة.
       أرجع النتيجة كـ JSON صالح فقط.`
      : `You are an ATS (Applicant Tracking System) expert. Analyze the CV and provide a comprehensive score from 0-100 for each category.
       Return the result as valid JSON only.`;

  const prompt = `Analyze this CV data and provide ATS scoring:

${JSON.stringify(cvData, null, 2)}

Provide scores for:
1. Overall formatting and structure
2. Keyword optimization
3. Experience relevance
4. Education formatting
5. Skills presentation

Return as JSON with this exact structure:
{
  "overall": number,
  "categories": {
    "formatting": {"score": number, "feedback": ["string"]},
    "keywords": {"score": number, "matched": ["string"], "missing": ["string"], "feedback": ["string"]},
    "experience": {"score": number, "feedback": ["string"]},
    "education": {"score": number, "feedback": ["string"]},
    "skills": {"score": number, "feedback": ["string"]}
  },
  "recommendations": ["string"],
  "estimatedPassRate": number
}`;

  const response = await makeOpenAICall(
    [{ role: "user", content: prompt }],
    systemPrompt,
    { responseFormat: "json", temperature: 0.3 }
  );

  try {
    return JSON.parse(response) as ATSScore;
  } catch {
    throw new OpenAIError("Invalid JSON response from OpenAI");
  }
};

// Job Description Matching
export const matchCVWithJob = async (
  cvData: CVData,
  jobDescription: JobDescription,
  language: "en" | "ar" = "en"
): Promise<MatchAnalysis> => {
  const identifier = `match_${Date.now()}`;

  if (!checkRateLimit(identifier)) {
    throw new OpenAIError(
      "Rate limit exceeded. Please try again later.",
      "RATE_LIMIT"
    );
  }

  const systemPrompt =
    language === "ar"
      ? `أنت خبير في مطابقة السير الذاتية مع الوظائف. قم بتحليل مدى التطابق وقدم توصيات محددة.
       أرجع النتيجة كـ JSON صالح فقط.`
      : `You are a CV-Job matching expert. Analyze how well the CV matches the job requirements and provide specific recommendations.
       Return the result as valid JSON only.`;

  const prompt = `Match this CV with the job description:

CV Data:
${JSON.stringify(cvData, null, 2)}

Job Description:
${JSON.stringify(jobDescription, null, 2)}

Analyze and return JSON with this structure:
{
  "overallMatch": number,
  "skillsMatch": {
    "matched": ["string"],
    "missing": ["string"],
    "percentage": number
  },
  "experienceMatch": {
    "relevant": boolean,
    "yearsMatch": boolean,
    "percentage": number
  },
  "educationMatch": {
    "relevant": boolean,
    "percentage": number
  },
  "recommendations": ["string"],
  "improvementAreas": [{"area": "string", "priority": "high|medium|low", "suggestions": ["string"]}]
}`;

  const response = await makeOpenAICall(
    [{ role: "user", content: prompt }],
    systemPrompt,
    { responseFormat: "json", temperature: 0.3 }
  );

  try {
    return JSON.parse(response) as MatchAnalysis;
  } catch {
    throw new OpenAIError("Invalid JSON response from OpenAI");
  }
};

// CV Enhancement Suggestions
export const generateCVSuggestions = async (
  cvData: CVData,
  targetRole?: string,
  language: "en" | "ar" = "en"
): Promise<string[]> => {
  const identifier = `suggestions_${Date.now()}`;

  if (!checkRateLimit(identifier)) {
    throw new OpenAIError(
      "Rate limit exceeded. Please try again later.",
      "RATE_LIMIT"
    );
  }

  const systemPrompt =
    language === "ar"
      ? `أنت خبير في تطوير السير الذاتية. قدم 5-10 اقتراحات محددة لتحسين السيرة الذاتية.`
      : `You are a CV enhancement expert. Provide 5-10 specific suggestions to improve this CV.`;

  const prompt = `Analyze this CV and provide improvement suggestions:

CV Data:
${JSON.stringify(cvData, null, 2)}

${targetRole ? `Target Role: ${targetRole}` : ""}

Provide specific, actionable suggestions as a JSON array of strings:
["suggestion 1", "suggestion 2", ...]`;

  const response = await makeOpenAICall(
    [{ role: "user", content: prompt }],
    systemPrompt,
    { responseFormat: "json", temperature: 0.6 }
  );

  try {
    return JSON.parse(response) as string[];
  } catch {
    throw new OpenAIError("Invalid JSON response from OpenAI");
  }
};

export { openai };
