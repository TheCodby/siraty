"use client";

import { useState, useCallback } from "react";
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
  currentStep: number;
  cvData: CVData;
  isLoading: boolean;
  errors: Record<string, string>;
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

export const useCVBuilder = () => {
  const [state, setState] = useState<CVBuilderState>({
    currentStep: 1,
    cvData: initialCVData,
    isLoading: false,
    errors: {},
  });

  const updatePersonalInfo = useCallback((personalInfo: PersonalInfo) => {
    setState((prev) => ({
      ...prev,
      cvData: {
        ...prev.cvData,
        personalInfo,
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const updateWorkExperience = useCallback(
    (workExperience: WorkExperience[]) => {
      setState((prev) => ({
        ...prev,
        cvData: {
          ...prev.cvData,
          workExperience,
          updatedAt: new Date().toISOString(),
        },
      }));
    },
    []
  );

  const updateEducation = useCallback((education: Education[]) => {
    setState((prev) => ({
      ...prev,
      cvData: {
        ...prev.cvData,
        education,
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const updateSkills = useCallback((skills: Skill[]) => {
    setState((prev) => ({
      ...prev,
      cvData: {
        ...prev.cvData,
        skills,
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const updateProjects = useCallback((projects: Project[]) => {
    setState((prev) => ({
      ...prev,
      cvData: {
        ...prev.cvData,
        projects,
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const updateCertifications = useCallback(
    (certifications: Certification[]) => {
      setState((prev) => ({
        ...prev,
        cvData: {
          ...prev.cvData,
          certifications,
          updatedAt: new Date().toISOString(),
        },
      }));
    },
    []
  );

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 5),
    }));
  }, []);

  const previousStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, Math.min(step, 5)),
    }));
  }, []);

  const calculateCompletionPercentage = useCallback((): number => {
    const { personalInfo, workExperience, education, skills } = state.cvData;

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
  }, [state.cvData]);

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((key: string, error: string) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [key]: error },
    }));
  }, []);

  const clearError = useCallback((key: string) => {
    setState((prev) => {
      const newErrors = { ...prev.errors };
      delete newErrors[key];
      return { ...prev, errors: newErrors };
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      currentStep: 1,
      cvData: { ...initialCVData, id: Date.now().toString() },
      isLoading: false,
      errors: {},
    });
  }, []);

  return {
    // State
    currentStep: state.currentStep,
    cvData: state.cvData,
    isLoading: state.isLoading,
    errors: state.errors,
    completionPercentage: calculateCompletionPercentage(),

    // Actions
    updatePersonalInfo,
    updateWorkExperience,
    updateEducation,
    updateSkills,
    updateProjects,
    updateCertifications,
    nextStep,
    previousStep,
    goToStep,
    setLoading,
    setError,
    clearError,
    reset,
  };
};
