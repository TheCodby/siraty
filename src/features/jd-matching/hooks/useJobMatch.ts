import { useState, useCallback } from "react";
import type { MatchAnalysis } from "@/types/ai";
import type { CVData } from "@/types/cv";
import type { JobDescription } from "@/types/job";

interface UseJobMatchOptions {
  language?: "en" | "ar";
  onError?: (error: string) => void;
  onSuccess?: (analysis: MatchAnalysis) => void;
}

interface UseJobMatchReturn {
  analysis: MatchAnalysis | null;
  isLoading: boolean;
  error: string | null;
  matchJob: (cvData: CVData, jobDescription: JobDescription) => Promise<void>;
  clearAnalysis: () => void;
  clearError: () => void;
}

export const useJobMatch = ({
  language = "en",
  onError,
  onSuccess,
}: UseJobMatchOptions = {}): UseJobMatchReturn => {
  const [analysis, setAnalysis] = useState<MatchAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const matchJob = useCallback(
    async (cvData: CVData, jobDescription: JobDescription) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/match-job", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cvData,
            jobDescription,
            language,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to match job");
        }

        const matchAnalysis = await response.json();
        setAnalysis(matchAnalysis);
        onSuccess?.(matchAnalysis);
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

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    analysis,
    isLoading,
    error,
    matchJob,
    clearAnalysis,
    clearError,
  };
};
