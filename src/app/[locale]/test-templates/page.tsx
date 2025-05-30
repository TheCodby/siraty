"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TemplateSelector } from "@/features/cv-builder/components/TemplateSelector";
import { useTemplateGeneration } from "@/features/cv-builder/hooks/useTemplateGeneration";
import type { CVData, WordTemplate } from "@/types";
import { FileImage, FileText, Download, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Mock CV data for testing
const mockCVData: CVData = {
  id: "test-cv",
  personalInfo: {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    linkedIn: "https://linkedin.com/in/johndoe",
    portfolio: "https://johndoe.dev",
    summary:
      "Experienced software engineer with 5+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies.",
  },
  workExperience: [
    {
      id: "work-1",
      jobTitle: "Senior Software Engineer",
      company: "Tech Corp",
      location: "New York, NY",
      startDate: "2021-06",
      endDate: "Present",
      isCurrentRole: true,
      description:
        "Led development of microservices architecture serving 1M+ users",
      achievements: [
        "Improved system performance by 40%",
        "Mentored 3 junior developers",
      ],
      technologies: ["React", "Node.js", "AWS"],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Science in Computer Science",
      institution: "State University",
      location: "New York, NY",
      graduationDate: "2019-05",
      gpa: "3.8",
      honors: ["Magna Cum Laude"],
    },
  ],
  skills: [
    {
      id: "skill-1",
      name: "JavaScript",
      level: "expert",
      category: "technical",
    },
    { id: "skill-2", name: "React", level: "expert", category: "technical" },
    {
      id: "skill-3",
      name: "Node.js",
      level: "advanced",
      category: "technical",
    },
    { id: "skill-4", name: "Leadership", level: "advanced", category: "soft" },
  ],
  projects: [
    {
      id: "project-1",
      name: "E-commerce Platform",
      description:
        "Built a full-stack e-commerce platform using React and Node.js",
      technologies: ["React", "Node.js", "MongoDB", "AWS"],
      startDate: "2023-01",
      endDate: "2023-06",
      link: "https://ecommerce-demo.com",
      repository: "https://github.com/johndoe/ecommerce",
    },
  ],
  certifications: [],
  languages: [],
  createdAt: "2024-01-01",
  updatedAt: "2024-01-15",
};

export default function TestTemplatesPage() {
  const {
    selectedTemplate,
    isGenerating,
    generationProgress,
    error,
    lastGenerated,
    selectTemplate,
    generateCV,
    downloadFile,
    clearError,
  } = useTemplateGeneration();

  const [lastTestedFormat, setLastTestedFormat] = useState<string | null>(null);

  const handleTemplateSelect = (template: WordTemplate) => {
    selectTemplate(template);
  };

  const handleTestGeneration = async (format: "pdf" | "docx" | "both") => {
    if (!selectedTemplate) {
      alert("Please select a template first");
      return;
    }

    setLastTestedFormat(format);
    clearError();

    const result = await generateCV(mockCVData, {
      format,
      fileName: `test-cv-${format}`,
      language: "en",
    });

    if (result && format === "both") {
      console.log("Generated files:", result);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Template System Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                This page tests the Word template generation system with mock CV
                data. Select a template and test the generation functionality.
              </p>

              {/* Status */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Generation Status</h3>
                  {lastTestedFormat && (
                    <Badge variant="outline">
                      Last tested: {lastTestedFormat.toUpperCase()}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isGenerating
                            ? "bg-yellow-500 animate-pulse"
                            : selectedTemplate
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span className="text-sm text-muted-foreground">
                        Template Selected: {selectedTemplate?.name || "None"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isGenerating
                            ? "bg-blue-500 animate-pulse"
                            : generationProgress === 100
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span className="text-sm text-muted-foreground">
                        Generation: {isGenerating ? "In Progress" : "Ready"}
                      </span>
                    </div>
                  </div>

                  {isGenerating && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{generationProgress}%</span>
                      </div>
                      <Progress value={generationProgress} className="h-2" />
                    </div>
                  )}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Generation Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {lastGenerated && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Files Generated:</h4>
                    <div className="space-y-2">
                      {lastGenerated.files.docx && (
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="font-medium">
                              {lastGenerated.files.docx.filename}
                            </span>
                            <Badge variant="secondary">
                              {(lastGenerated.files.docx.size / 1024).toFixed(
                                1
                              )}{" "}
                              KB
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              downloadFile(
                                lastGenerated.files.docx!.data,
                                lastGenerated.files.docx!.filename,
                                lastGenerated.files.docx!.mimeType
                              )
                            }
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      )}
                      {lastGenerated.files.pdf && (
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileImage className="h-4 w-4" />
                            <span className="font-medium">
                              {lastGenerated.files.pdf.filename}
                            </span>
                            <Badge variant="secondary">
                              {(lastGenerated.files.pdf.size / 1024).toFixed(1)}{" "}
                              KB
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              downloadFile(
                                lastGenerated.files.pdf!.data,
                                lastGenerated.files.pdf!.filename,
                                lastGenerated.files.pdf!.mimeType
                              )
                            }
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Template Selection */}
        <TemplateSelector
          cvData={mockCVData}
          selectedTemplate={selectedTemplate}
          onSelectTemplate={handleTemplateSelect}
        />

        {/* Test Generation */}
        {selectedTemplate && (
          <Card>
            <CardHeader>
              <CardTitle>Test Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => handleTestGeneration("pdf")}
                    disabled={isGenerating}
                    variant="outline"
                    className="flex-1"
                  >
                    <FileImage className="h-4 w-4 mr-2" />
                    Test PDF Only
                    <div className="text-xs text-muted-foreground ml-2">
                      (Word → PDF conversion)
                    </div>
                  </Button>
                  <Button
                    onClick={() => handleTestGeneration("docx")}
                    disabled={isGenerating}
                    variant="outline"
                    className="flex-1"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Test Word Only
                    <div className="text-xs text-muted-foreground ml-2">
                      (Direct .docx file)
                    </div>
                  </Button>
                  <Button
                    onClick={() => handleTestGeneration("both")}
                    disabled={isGenerating}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Test Both Formats
                    <div className="text-xs text-muted-foreground ml-2">
                      (JSON with both files)
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
