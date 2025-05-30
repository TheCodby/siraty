"use client";

import { useState, useCallback } from "react";
import type {
  CVData,
  WordTemplate,
  TemplateGenerationOptions,
  GeneratedDocument,
} from "@/types";

interface UseTemplateGenerationState {
  selectedTemplate: WordTemplate | null;
  isGenerating: boolean;
  generationProgress: number;
  error: string | null;
  lastGenerated: GeneratedDocument | null;
}

export const useTemplateGeneration = () => {
  const [state, setState] = useState<UseTemplateGenerationState>({
    selectedTemplate: null,
    isGenerating: false,
    generationProgress: 0,
    error: null,
    lastGenerated: null,
  });

  const selectTemplate = useCallback((template: WordTemplate) => {
    setState((prev) => ({
      ...prev,
      selectedTemplate: template,
      error: null,
    }));
  }, []);

  const generateCV = useCallback(
    async (
      cvData: CVData,
      options: Omit<TemplateGenerationOptions, "templateId">
    ): Promise<GeneratedDocument | null> => {
      if (!state.selectedTemplate) {
        setState((prev) => ({
          ...prev,
          error: "Please select a template first",
        }));
        return null;
      }

      setState((prev) => ({
        ...prev,
        isGenerating: true,
        generationProgress: 0,
        error: null,
      }));

      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setState((prev) => ({
            ...prev,
            generationProgress: Math.min(prev.generationProgress + 10, 90),
          }));
        }, 500);

        const response = await fetch("/api/generate-cv", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cvData,
            options: {
              ...options,
              templateId: state.selectedTemplate.id,
            },
          }),
        });

        clearInterval(progressInterval);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP ${response.status}: ${response.statusText}`
          );
        }

        // Handle different response types
        const contentType = response.headers.get("content-type");

        if (contentType?.includes("application/json")) {
          // JSON response for "both" format
          const result: GeneratedDocument = await response.json();

          setState((prev) => ({
            ...prev,
            isGenerating: false,
            generationProgress: 100,
            lastGenerated: result,
          }));

          return result;
        } else {
          // Binary response for single format (PDF or DOCX)
          const blob = await response.blob();
          const contentDisposition = response.headers.get(
            "content-disposition"
          );
          const filename =
            contentDisposition?.match(/filename="([^"]+)"/)?.[1] ||
            "cv-document";

          // Trigger download
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

          setState((prev) => ({
            ...prev,
            isGenerating: false,
            generationProgress: 100,
          }));

          return null; // No JSON response for direct downloads
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isGenerating: false,
          generationProgress: 0,
          error:
            error instanceof Error ? error.message : "Failed to generate CV",
        }));
        return null;
      }
    },
    [state.selectedTemplate]
  );

  const downloadFile = useCallback(
    (fileData: string, filename: string, mimeType: string) => {
      try {
        const binaryString = atob(fileData);
        const bytes = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: mimeType });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Failed to download file:", error);
        setState((prev) => ({
          ...prev,
          error: "Failed to download file",
        }));
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      selectedTemplate: null,
      isGenerating: false,
      generationProgress: 0,
      error: null,
      lastGenerated: null,
    });
  }, []);

  return {
    // State
    selectedTemplate: state.selectedTemplate,
    isGenerating: state.isGenerating,
    generationProgress: state.generationProgress,
    error: state.error,
    lastGenerated: state.lastGenerated,

    // Actions
    selectTemplate,
    generateCV,
    downloadFile,
    clearError,
    reset,
  };
};
