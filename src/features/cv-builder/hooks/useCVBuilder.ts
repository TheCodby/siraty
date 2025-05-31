"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getLocalStorageItem,
  setLocalStorageItem,
  STORAGE_KEYS,
  clearCVBuilderData,
} from "@/lib/localStorage";
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
  isDataLoaded: boolean; // Track if we've loaded data from localStorage
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
    isDataLoaded: false,
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadSavedData = () => {
      const savedCVData = getLocalStorageItem<CVData | null>(
        STORAGE_KEYS.CV_BUILDER_DATA,
        null
      );
      const savedStep = getLocalStorageItem<number>(
        STORAGE_KEYS.CV_BUILDER_STEP,
        1
      );

      if (savedCVData) {
        setState((prev) => ({
          ...prev,
          cvData: {
            ...savedCVData,
            // Ensure we have a valid ID
            id: savedCVData.id || Date.now().toString(),
          },
          currentStep: savedStep,
          isDataLoaded: true,
        }));
      } else {
        // Initialize with a new ID if no saved data
        setState((prev) => ({
          ...prev,
          cvData: {
            ...initialCVData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
          },
          isDataLoaded: true,
        }));
      }
    };

    loadSavedData();
  }, []);

  // Save CV data to localStorage whenever it changes
  useEffect(() => {
    if (state.isDataLoaded && state.cvData.id) {
      setLocalStorageItem(STORAGE_KEYS.CV_BUILDER_DATA, state.cvData);
    }
  }, [state.cvData, state.isDataLoaded]);

  // Save current step to localStorage whenever it changes
  useEffect(() => {
    if (state.isDataLoaded) {
      setLocalStorageItem(STORAGE_KEYS.CV_BUILDER_STEP, state.currentStep);
    }
  }, [state.currentStep, state.isDataLoaded]);

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
    // Clear localStorage data
    clearCVBuilderData();

    setState({
      currentStep: 1,
      cvData: {
        ...initialCVData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      },
      isLoading: false,
      errors: {},
      isDataLoaded: true,
    });
  }, []);

  const clearSavedData = useCallback(() => {
    const success = clearCVBuilderData();
    if (success) {
      setState((prev) => ({
        ...prev,
        cvData: {
          ...initialCVData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        },
        currentStep: 1,
        errors: {},
      }));
    }
    return success;
  }, []);

  return {
    // State
    currentStep: state.currentStep,
    cvData: state.cvData,
    isLoading: state.isLoading,
    errors: state.errors,
    completionPercentage: calculateCompletionPercentage(),
    isDataLoaded: state.isDataLoaded,

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
    clearSavedData,
  };
};
