"use client";

import {
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  Edit3,
  Loader2,
  AlertTriangle,
  FileImage,
  Settings,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { TemplateSelector } from "./TemplateSelector";
import { useTemplateGeneration } from "../hooks/useTemplateGeneration";
import type { CVData } from "@/types";

interface ReviewFormProps {
  cvData: CVData;
  completionPercentage: number;
  onPrevious: () => void;
  onDownload: () => void;
  onEditSection: (step: number) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  cvData,
  completionPercentage,
  onPrevious,
  onEditSection,
}) => {
  const { personalInfo, workExperience, education, skills, projects } = cvData;

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

  // Updated sections to match the actual 6-step process
  const sections = [
    {
      title: "Personal Information",
      step: 1,
      icon: User,
      data: personalInfo,
      isComplete: !!(
        personalInfo.fullName &&
        personalInfo.email &&
        personalInfo.phone &&
        personalInfo.location &&
        personalInfo.summary
      ),
    },
    {
      title: "Work Experience",
      step: 2,
      icon: Briefcase,
      data: workExperience,
      isComplete: workExperience.length > 0,
    },
    {
      title: "Education",
      step: 3,
      icon: GraduationCap,
      data: education,
      isComplete: education.length > 0,
    },
    {
      title: "Skills",
      step: 4,
      icon: Code,
      data: skills,
      isComplete: skills.length > 0,
    },
    {
      title: "Projects",
      step: 5,
      icon: FolderOpen,
      data: projects,
      isComplete: true, // Projects are optional
    },
  ];

  const requiredSections = sections.filter((section) => section.step <= 4); // Only first 4 steps are required
  const completedRequiredSections = requiredSections.filter(
    (section) => section.isComplete
  );
  const isReadyForDownload =
    completedRequiredSections.length >= 3 && selectedTemplate; // Need at least 3/4 required sections + template

  const handleGenerateCV = async (format: "pdf" | "docx" | "both") => {
    if (!selectedTemplate) {
      return;
    }

    clearError();

    try {
      await generateCV(cvData, {
        format,
        language: "en", // You can make this dynamic based on user preference
        fileName: `${personalInfo.fullName || "cv"}-${selectedTemplate.name
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
      });
    } catch (error) {
      console.error("Generation failed:", error);
    }
  };

  const handleDownloadGenerated = (format: "pdf" | "docx") => {
    if (!lastGenerated) return;

    const fileData =
      format === "pdf"
        ? lastGenerated.files.pdf?.data
        : lastGenerated.files.docx?.data;
    const filename =
      format === "pdf"
        ? lastGenerated.files.pdf?.filename
        : lastGenerated.files.docx?.filename;
    const mimeType =
      format === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (fileData && filename) {
      downloadFile(fileData, filename, mimeType);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Review & Download Your CV
        </CardTitle>
        <CardDescription>
          Review your information, select a template, and download your
          professional CV
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Completion Status */}
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Your CV is {Math.round(completionPercentage)}% complete.{" "}
            {isReadyForDownload
              ? "Ready for download!"
              : "Complete missing sections and select a template to download."}
          </AlertDescription>
        </Alert>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={clearError}>
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Generation Progress */}
        {isGenerating && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Generating your CV...</span>
                <span className="text-sm font-medium">
                  {generationProgress}%
                </span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </AlertDescription>
          </Alert>
        )}

        {/* CV Sections Review */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              CV Sections
            </h3>
            <div className="text-sm text-muted-foreground">
              {completedRequiredSections.length}/{requiredSections.length}{" "}
              required sections completed
            </div>
          </div>

          <div className="grid gap-3">
            {sections.map((section) => {
              const Icon = section.icon;
              const isRequired = section.step <= 4;
              return (
                <div
                  key={section.step}
                  className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                    section.isComplete
                      ? "border-green-200 bg-green-50"
                      : isRequired
                      ? "border-orange-200 bg-orange-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-5 w-5 ${
                        section.isComplete
                          ? "text-green-600"
                          : isRequired
                          ? "text-orange-600"
                          : "text-gray-400"
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">
                          {section.title}
                        </p>
                        {!isRequired && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            Optional
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          section.isComplete
                            ? "text-green-600"
                            : isRequired
                            ? "text-orange-600"
                            : "text-gray-500"
                        }`}
                      >
                        {section.isComplete
                          ? "Complete"
                          : isRequired
                          ? "Required - Please complete"
                          : "Optional"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {section.isComplete ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : isRequired ? (
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                    ) : (
                      <div className="h-5 w-5" /> // Empty space for alignment
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditSection(section.step)}
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      {section.isComplete ? "Edit" : "Complete"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Template Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Choose Your Template
          </h3>
          {selectedTemplate ? (
            <Alert>
              <Settings className="h-4 w-4" />
              <AlertDescription>
                <strong>Selected:</strong> {selectedTemplate.name} -{" "}
                {selectedTemplate.description}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please select a template below to enable CV download.
              </AlertDescription>
            </Alert>
          )}
          <TemplateSelector
            cvData={cvData}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={selectTemplate}
          />
        </div>

        <Separator />

        {/* Download Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-foreground">
            Download Your CV
          </h3>

          {/* Download Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-6 border-2"
              disabled={!isReadyForDownload || isGenerating}
              onClick={() => handleGenerateCV("pdf")}
            >
              <div className="text-center">
                <FileImage className="h-8 w-8 mx-auto mb-3 text-red-600" />
                <div className="font-semibold text-lg">PDF Download</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Perfect for job applications
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 border-2"
              disabled={!isReadyForDownload || isGenerating}
              onClick={() => handleGenerateCV("docx")}
            >
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <div className="font-semibold text-lg">Word Download</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Editable document format
                </div>
              </div>
            </Button>

            <Button
              className="h-auto p-6 border-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={!isReadyForDownload || isGenerating}
              onClick={() => handleGenerateCV("both")}
            >
              <div className="text-center">
                <Download className="h-8 w-8 mx-auto mb-3" />
                <div className="font-semibold text-lg">Download Both</div>
                <div className="text-sm opacity-90 mt-1">PDF + Word files</div>
              </div>
            </Button>
          </div>

          {/* Status Messages */}
          {!isReadyForDownload && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {!selectedTemplate
                  ? "Select a template above to enable download."
                  : `Complete at least ${
                      requiredSections.length - 1
                    } required sections to enable download.`}
              </AlertDescription>
            </Alert>
          )}

          {/* Generated Files */}
          {lastGenerated && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  CV Generated Successfully!
                </CardTitle>
                <CardDescription className="text-green-600">
                  Your CV has been generated and is ready for download.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-3">
                  {lastGenerated.files.pdf && (
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadGenerated("pdf")}
                      className="border-green-300 text-green-700 hover:bg-green-100"
                    >
                      <FileImage className="h-4 w-4 mr-2" />
                      Download PDF (
                      {(lastGenerated.files.pdf.size / 1024).toFixed(0)}KB)
                    </Button>
                  )}
                  {lastGenerated.files.docx && (
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadGenerated("docx")}
                      className="border-green-300 text-green-700 hover:bg-green-100"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Download Word (
                      {(lastGenerated.files.docx.size / 1024).toFixed(0)}KB)
                    </Button>
                  )}
                </div>
                <div className="text-sm text-green-600">
                  <strong>Template:</strong>{" "}
                  {lastGenerated.metadata.templateUsed} |
                  <strong> Generated:</strong>{" "}
                  {new Date(
                    lastGenerated.metadata.generatedAt
                  ).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator />

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            ← Previous: Projects
          </Button>

          <div className="text-sm text-muted-foreground flex items-center">
            Final step - Download your CV above
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
