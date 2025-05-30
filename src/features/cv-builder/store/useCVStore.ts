"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CVData,
  PersonalInfo,
  WorkExperience,
  Education,
  Skill,
  Project,
  Certification,
} from "@/types";

interface CVBuilderState {
  // State
  currentStep: number;
  cvData: CVData;
  isLoading: boolean;
  errors: Record<string, string>;

  // Computed
  completionPercentage: () => number;

  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;

  updatePersonalInfo: (personalInfo: PersonalInfo) => void;
  updateWorkExperience: (workExperience: WorkExperience[]) => void;
  updateEducation: (education: Education[]) => void;
  updateSkills: (skills: Skill[]) => void;
  updateProjects: (projects: Project[]) => void;
  updateCertifications: (certifications: Certification[]) => void;

  setLoading: (isLoading: boolean) => void;
  setError: (key: string, error: string) => void;
  clearError: (key: string) => void;
  clearAllErrors: () => void;

  reset: () => void;
}

const initialPersonalInfo: PersonalInfo = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedIn: "",
  portfolio: "",
  summary: "",
};

const initialCVData: CVData = {
  id: "",
  personalInfo: initialPersonalInfo,
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  createdAt: "",
  updatedAt: "",
};

export const useCVStore = create<CVBuilderState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 1,
      cvData: initialCVData,
      isLoading: false,
      errors: {},

      // Computed values
      completionPercentage: () => {
        const { cvData } = get();
        const { personalInfo, workExperience, education, skills } = cvData;

        let totalFields = 0;
        let completedFields = 0;

        // Personal info (weight: 40%)
        const personalInfoFields = [
          personalInfo.fullName,
          personalInfo.email,
          personalInfo.phone,
          personalInfo.location,
          personalInfo.summary,
        ];

        totalFields += personalInfoFields.length;
        completedFields += personalInfoFields.filter(
          (field) => field.trim() !== ""
        ).length;

        // Work experience (weight: 30%)
        const hasWorkExperience = workExperience.length > 0;
        totalFields += 1;
        if (hasWorkExperience) completedFields += 1;

        // Education (weight: 20%)
        const hasEducation = education.length > 0;
        totalFields += 1;
        if (hasEducation) completedFields += 1;

        // Skills (weight: 10%)
        const hasSkills = skills.length > 0;
        totalFields += 1;
        if (hasSkills) completedFields += 1;

        return Math.round((completedFields / totalFields) * 100);
      },

      // Step navigation actions
      setCurrentStep: (step: number) =>
        set({ currentStep: Math.max(1, Math.min(step, 5)) }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 5),
        })),

      previousStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),

      goToStep: (step: number) =>
        set({ currentStep: Math.max(1, Math.min(step, 5)) }),

      // CV data update actions
      updatePersonalInfo: (personalInfo: PersonalInfo) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            personalInfo,
            updatedAt: new Date().toISOString(),
          },
        })),

      updateWorkExperience: (workExperience: WorkExperience[]) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            workExperience,
            updatedAt: new Date().toISOString(),
          },
        })),

      updateEducation: (education: Education[]) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            education,
            updatedAt: new Date().toISOString(),
          },
        })),

      updateSkills: (skills: Skill[]) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            skills,
            updatedAt: new Date().toISOString(),
          },
        })),

      updateProjects: (projects: Project[]) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projects,
            updatedAt: new Date().toISOString(),
          },
        })),

      updateCertifications: (certifications: Certification[]) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            certifications,
            updatedAt: new Date().toISOString(),
          },
        })),

      // Loading and error actions
      setLoading: (isLoading: boolean) => set({ isLoading }),

      setError: (key: string, error: string) =>
        set((state) => ({
          errors: { ...state.errors, [key]: error },
        })),

      clearError: (key: string) =>
        set((state) => {
          const newErrors = { ...state.errors };
          delete newErrors[key];
          return { errors: newErrors };
        }),

      clearAllErrors: () => set({ errors: {} }),

      // Reset action
      reset: () =>
        set({
          currentStep: 1,
          cvData: { ...initialCVData, id: Date.now().toString() },
          isLoading: false,
          errors: {},
        }),
    }),
    {
      name: "cv-builder-storage", // localStorage key
      // Only persist the CV data and current step, not loading states or errors
      partialize: (state) => ({
        currentStep: state.currentStep,
        cvData: state.cvData,
      }),
    }
  )
);
