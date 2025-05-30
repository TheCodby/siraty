"use client";

import {
  FileText,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  Edit3,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

  const isReadyForDownload = completionPercentage >= 80;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Review & Download
        </CardTitle>
        <CardDescription>
          Review your CV details and download when ready
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
              : "Add more information to improve your CV."}
          </AlertDescription>
        </Alert>

        {/* Section Review */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Section Review
          </h3>

          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.step} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium text-foreground">
                          {section.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {section.isComplete ? "Complete" : "Incomplete"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {section.isComplete ? (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Incomplete
                        </Badge>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditSection(section.step)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Separator />

        {/* CV Summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">CV Summary</h3>

          <div className="bg-muted rounded-lg p-6 space-y-4">
            {/* Header */}
            <div className="text-center border-b border-border pb-4">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {personalInfo.fullName || "Your Name"}
              </h1>
              <div className="text-sm text-muted-foreground space-y-1">
                {personalInfo.email && <div>{personalInfo.email}</div>}
                {personalInfo.phone && <div>{personalInfo.phone}</div>}
                {personalInfo.location && <div>{personalInfo.location}</div>}
              </div>
            </div>

            {/* Summary */}
            {personalInfo.summary && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Professional Summary
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {personalInfo.summary}
                </p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
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

        <Separator />

        {/* Download Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Download Options
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4"
              disabled={!isReadyForDownload}
            >
              <div className="text-center">
                <Eye className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">Preview PDF</div>
                <div className="text-xs text-muted-foreground">
                  Preview before download
                </div>
              </div>
            </Button>

            <Button
              className="h-auto p-4"
              onClick={onDownload}
              disabled={!isReadyForDownload}
            >
              <div className="text-center">
                <Download className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">Download PDF</div>
                <div className="text-xs text-muted-foreground">
                  Get your professional CV
                </div>
              </div>
            </Button>
          </div>

          {!isReadyForDownload && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Complete at least 80% of your CV to enable download. Focus on
                adding more work experience and skills.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Separator />

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrevious}>
            Previous
          </Button>

          <Button
            onClick={onDownload}
            disabled={!isReadyForDownload}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download CV
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
