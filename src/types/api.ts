import type { CVData } from "./cv";
import type { ATSScore, MatchAnalysis } from "./ai";

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChatResponse extends APIResponse {
  data: {
    message: string;
    suggestions?: string[];
    updatedCV?: Partial<CVData>;
  };
}

export interface ATSResponse extends APIResponse {
  data: ATSScore;
}

export interface MatchResponse extends APIResponse {
  data: MatchAnalysis;
}
