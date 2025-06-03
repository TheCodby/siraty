import { useState, useCallback } from "react";
import type { ATSScore } from "@/types/ai";
import type { CVData } from "@/types/cv";

interface UseATSScoreOptions {
  language?: "en" | "ar";
  onError?: (error: string) => void;
  onSuccess?: (score: ATSScore) => void;
}

interface UseATSScoreReturn {
  score: ATSScore | null;
  isLoading: boolean;
  error: string | null;
  analyzeCV: (cvData: CVData) => Promise<void>;
  clearScore: () => void;
  clearError: () => void;
}

export const useATSScore = ({
  language = "en",
  onError,
  onSuccess,
}: UseATSScoreOptions = {}): UseATSScoreReturn => {
  const [score, setScore] = useState<ATSScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeCV = useCallback(
    async (cvData: CVData) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ats-score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cvData,
            language,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to analyze CV");
        }

        const atsScore = await response.json();
        setScore(atsScore);
        onSuccess?.(atsScore);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [language, onError, onSuccess]
  );

  const clearScore = useCallback(() => {
    setScore(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    score,
    isLoading,
    error,
    analyzeCV,
    clearScore,
    clearError,
  };
};
