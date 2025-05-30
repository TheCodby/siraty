import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CVData,
  JobDescription,
  ATSScore,
  MatchAnalysis,
  ChatMessage,
} from "@/types";

interface AppState {
  // CV Data
  currentCV: CVData | null;
  savedCVs: CVData[];

  // Job Description Data
  currentJobDescription: JobDescription | null;

  // ATS Score Data
  currentATSScore: ATSScore | null;

  // Match Analysis Data
  currentMatchAnalysis: MatchAnalysis | null;

  // Chat Data
  chatMessages: ChatMessage[];

  // UI State
  theme: "light" | "dark";

  // Actions
  setCurrentCV: (cv: CVData | null) => void;
  setSavedCVs: (cvs: CVData[]) => void;
  addSavedCV: (cv: CVData) => void;
  removeSavedCV: (id: string) => void;

  setCurrentJobDescription: (jd: JobDescription | null) => void;
  setCurrentATSScore: (score: ATSScore | null) => void;
  setCurrentMatchAnalysis: (analysis: MatchAnalysis | null) => void;

  addChatMessage: (message: ChatMessage) => void;
  clearChatMessages: () => void;

  setTheme: (theme: "light" | "dark") => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      currentCV: null,
      savedCVs: [],
      currentJobDescription: null,
      currentATSScore: null,
      currentMatchAnalysis: null,
      chatMessages: [],
      theme: "light",

      // CV Actions
      setCurrentCV: (cv) => set({ currentCV: cv }),
      setSavedCVs: (cvs) => set({ savedCVs: cvs }),
      addSavedCV: (cv) =>
        set((state) => ({
          savedCVs: [...state.savedCVs, cv],
        })),
      removeSavedCV: (id) =>
        set((state) => ({
          savedCVs: state.savedCVs.filter((cv) => cv.id !== id),
        })),

      // Job Description Actions
      setCurrentJobDescription: (jd) => set({ currentJobDescription: jd }),

      // ATS Score Actions
      setCurrentATSScore: (score) => set({ currentATSScore: score }),

      // Match Analysis Actions
      setCurrentMatchAnalysis: (analysis) =>
        set({ currentMatchAnalysis: analysis }),

      // Chat Actions
      addChatMessage: (message) =>
        set((state) => ({
          chatMessages: [...state.chatMessages, message],
        })),
      clearChatMessages: () => set({ chatMessages: [] }),

      // Theme Actions
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "siraty-storage",
      partialize: (state) => ({
        savedCVs: state.savedCVs,
        theme: state.theme,
        chatMessages: state.chatMessages,
      }),
    }
  )
);
