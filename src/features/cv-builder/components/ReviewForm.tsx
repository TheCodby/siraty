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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  onDownload,
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

  const sections = [
    {
      title: "Personal Information",
      step: 1,
      icon: FileText,
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
      icon: FileText,
      data: workExperience,
      isComplete: workExperience.length > 0,
    },
    {
      title: "Education",
      step: 3,
      icon: FileText,
      data: education,
      isComplete: education.length > 0,
    },
    {
      title: "Skills & Projects",
      step: 4,
      icon: FileText,
      data: { skills, projects },
      isComplete: skills.length > 0,
    },
  ];

  const isReadyForDownload = completionPercentage >= 80 && selectedTemplate;

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
          Review & Download
        </CardTitle>
        <CardDescription>
          Review your CV details, select a template, and download when ready
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Completion Status */}
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Your CV is {Math.round(completionPercentage)}% complete.{" "}
            {isReadyForDownload
              ? "Ready for download!"
              : selectedTemplate
              ? "Add more information to improve your CV."
              : "Select a template to continue."}
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

        <Tabs defaultValue="review" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="review">Review Content</TabsTrigger>
            <TabsTrigger value="template">Select Template</TabsTrigger>
            <TabsTrigger value="download">Download Options</TabsTrigger>
          </TabsList>

          <TabsContent value="review" className="space-y-6">
            {/* Section Review */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                CV Sections
              </h3>
              <div className="grid gap-4">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <div
                      key={section.step}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">
                            {section.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {section.isComplete ? "Complete" : "Incomplete"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {section.isComplete ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditSection(section.step)}
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CV Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                CV Summary
              </h3>
              <div className="bg-muted rounded-lg p-6 space-y-4">
                {/* Header */}
                <div className="text-center border-b border-border pb-4">
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {personalInfo.fullName || "Your Name"}
                  </h1>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {personalInfo.email && <div>{personalInfo.email}</div>}
                    {personalInfo.phone && <div>{personalInfo.phone}</div>}
                    {personalInfo.location && (
                      <div>{personalInfo.location}</div>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {personalInfo.summary && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">
                      Professional Summary
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed break-words">
                      {personalInfo.summary}
                    </p>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {workExperience.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Work Experiences
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {education.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Education Entries
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {skills.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Skills Listed
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {projects.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Projects Showcased
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="template" className="space-y-6">
            <TemplateSelector
              cvData={cvData}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={selectTemplate}
            />
          </TabsContent>

          <TabsContent value="download" className="space-y-6">
            {/* Template Selection Status */}
            {selectedTemplate ? (
              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  <strong>Selected Template:</strong> {selectedTemplate.name} -{" "}
                  {selectedTemplate.description}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Please select a template from the &quot;Select Template&quot;
                  tab before downloading.
                </AlertDescription>
              </Alert>
            )}

            {/* Download Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Download Options
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4"
                  disabled={!isReadyForDownload || isGenerating}
                  onClick={() => handleGenerateCV("pdf")}
                >
                  <div className="text-center">
                    <FileImage className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Download PDF</div>
                    <div className="text-xs text-muted-foreground">
                      Perfect for applications
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4"
                  disabled={!isReadyForDownload || isGenerating}
                  onClick={() => handleGenerateCV("docx")}
                >
                  <div className="text-center">
                    <FileText className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Download Word</div>
                    <div className="text-xs text-muted-foreground">
                      Editable document
                    </div>
                  </div>
                </Button>

                <Button
                  className="h-auto p-4"
                  disabled={!isReadyForDownload || isGenerating}
                  onClick={() => handleGenerateCV("both")}
                >
                  <div className="text-center">
                    <Download className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Download Both</div>
                    <div className="text-xs text-muted-foreground">
                      PDF + Word files
                    </div>
                  </div>
                </Button>
              </div>

              {/* Generated Files */}
              {lastGenerated && (
                <Card className="bg-green-50 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-800">
                      ✅ CV Generated Successfully!
                    </CardTitle>
                    <CardDescription className="text-green-600">
                      Your CV has been generated and is ready for download.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {lastGenerated.files.pdf && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadGenerated("pdf")}
                          className="border-green-300 text-green-700 hover:bg-green-100"
                        >
                          <FileImage className="h-4 w-4 mr-1" />
                          Download PDF
                        </Button>
                      )}
                      {lastGenerated.files.docx && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadGenerated("docx")}
                          className="border-green-300 text-green-700 hover:bg-green-100"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Download Word
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

              {!isReadyForDownload && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {!selectedTemplate
                      ? "Please select a template to enable download."
                      : "Complete at least 80% of your CV to enable download. Focus on adding more work experience and skills."}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            Previous
          </Button>

          <Button
            onClick={onDownload}
            disabled={!isReadyForDownload}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Continue to Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
