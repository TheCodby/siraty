import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  LinkedInCVData,
  LinkedInSyncState,
  LinkedInSyncOptions,
} from "../types";

interface UseLinkedInSyncReturn {
  syncState: LinkedInSyncState;
  syncFromLinkedIn: (
    options?: Partial<LinkedInSyncOptions>
  ) => Promise<LinkedInCVData | null>;
  clearError: () => void;
  isAuthenticated: boolean;
}

export const useLinkedInSync = (): UseLinkedInSyncReturn => {
  const { data: session, status } = useSession();
  const [syncState, setSyncState] = useState<LinkedInSyncState>({
    isLoading: false,
    error: undefined,
    profileData: undefined,
    lastSyncAt: undefined,
  });

  const isAuthenticated = status === "authenticated" && !!session?.accessToken;

  const syncFromLinkedIn = useCallback(
    async (
      options: Partial<LinkedInSyncOptions> = {}
    ): Promise<LinkedInCVData | null> => {
      if (!isAuthenticated) {
        setSyncState((prev) => ({
          ...prev,
          error: "Please sign in with LinkedIn to sync your profile data.",
        }));
        return null;
      }

      // Default options
      const defaultOptions: LinkedInSyncOptions = {
        includeProfile: true,
        includeExperience: true,
        includeEducation: true,
        includeSkills: true,
        overwriteExisting: false,
        ...options,
      };

      setSyncState((prev) => ({
        ...prev,
        isLoading: true,
        error: undefined,
      }));

      try {
        // Build query parameters based on options
        const queryParams = new URLSearchParams();
        if (!defaultOptions.includeProfile) queryParams.set("profile", "false");
        if (!defaultOptions.includeExperience)
          queryParams.set("experience", "false");
        if (!defaultOptions.includeEducation)
          queryParams.set("education", "false");
        if (!defaultOptions.includeSkills) queryParams.set("skills", "false");

        const response = await fetch(
          `/api/linkedin/profile?${queryParams.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch LinkedIn profile data"
          );
        }

        if (!result.success) {
          throw new Error(result.message || "LinkedIn sync was not successful");
        }

        const profileData = result.data as LinkedInCVData;

        setSyncState({
          isLoading: false,
          error: undefined,
          profileData,
          lastSyncAt: new Date(),
        });

        return profileData;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";

        setSyncState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        console.error("LinkedIn sync error:", error);
        return null;
      }
    },
    [isAuthenticated]
  );

  const clearError = useCallback(() => {
    setSyncState((prev) => ({
      ...prev,
      error: undefined,
    }));
  }, []);

  return {
    syncState,
    syncFromLinkedIn,
    clearError,
    isAuthenticated,
  };
};

// Utility hook for checking LinkedIn connection status
export const useLinkedInStatus = () => {
  const { data: session, status } = useSession();

  return {
    isLoading: status === "loading",
    isConnected: status === "authenticated" && !!session?.accessToken,
    user: session?.user,
    hasValidToken: !!session?.accessToken,
  };
};

// Hook for selective LinkedIn data fetching
export const useLinkedInSections = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const fetchSections = useCallback(
    async (sections: string[]) => {
      if (!session?.accessToken) {
        throw new Error("Not authenticated with LinkedIn");
      }

      setLoading(true);
      setError(undefined);

      try {
        const response = await fetch("/api/linkedin/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sections }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch LinkedIn data");
        }

        return result.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [session?.accessToken]
  );

  return {
    fetchSections,
    loading,
    error,
    clearError: () => setError(undefined),
  };
};
