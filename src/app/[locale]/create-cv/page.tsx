"use client";

import {
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen,
  Download,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  StepIndicator,
  type Step,
} from "@/features/cv-builder/components/StepIndicator";
import { PersonalInfoForm } from "@/features/cv-builder/components/PersonalInfoForm";
import { WorkExperienceForm } from "@/features/cv-builder/components/WorkExperienceForm";
import { EducationForm } from "@/features/cv-builder/components/EducationForm";
import { SkillsForm } from "@/features/cv-builder/components/SkillsForm";
import { ProjectsForm } from "@/features/cv-builder/components/ProjectsForm";
import { ReviewForm } from "@/features/cv-builder/components/ReviewForm";
import { CVPreview } from "@/features/cv-builder/components/CVPreview";
import { SaveStatusIndicator } from "@/features/cv-builder/components/SaveStatusIndicator";
import { useCVBuilder } from "@/features/cv-builder/hooks/useCVBuilder";

export default function CreateCVPage() {
  const t = useTranslations("cvBuilder");
  const tSteps = useTranslations("cvBuilder.steps");

  const steps: Step[] = [
    {
      id: 1,
      name: tSteps("personal"),
      description: t("stepDescriptions.personal"),
      icon: User,
      status: "current",
    },
    {
      id: 2,
      name: tSteps("experience"),
      description: t("stepDescriptions.experience"),
      icon: Briefcase,
      status: "upcoming",
    },
    {
      id: 3,
      name: tSteps("education"),
      description: t("stepDescriptions.education"),
      icon: GraduationCap,
      status: "upcoming",
    },
    {
      id: 4,
      name: tSteps("skills"),
      description: t("stepDescriptions.skills"),
      icon: Code,
      status: "upcoming",
    },
    {
      id: 5,
      name: tSteps("projects"),
      description: t("stepDescriptions.projects"),
      icon: FolderOpen,
      status: "upcoming",
    },
    {
      id: 6,
      name: tSteps("review"),
      description: t("stepDescriptions.review"),
      icon: Download,
      status: "upcoming",
    },
  ];

  const {
    currentStep,
    cvData,
    completionPercentage,
    isDataLoaded,
    updatePersonalInfo,
    updateWorkExperience,
    updateEducation,
    updateSkills,
    updateProjects,
    nextStep,
    previousStep,
    goToStep,
    clearSavedData,
  } = useCVBuilder();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoForm
            data={cvData.personalInfo}
            onUpdate={updatePersonalInfo}
            onNext={nextStep}
            onPrevious={previousStep}
            isFirstStep={true}
          />
        );
      case 2:
        return (
          <WorkExperienceForm
            data={cvData.workExperience}
            onUpdate={updateWorkExperience}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        );
      case 3:
        return (
          <EducationForm
            data={cvData.education}
            onUpdate={updateEducation}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        );
      case 4:
        return (
          <SkillsForm
            data={cvData.skills}
            onUpdate={updateSkills}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        );
      case 5:
        return (
          <ProjectsForm
            data={cvData.projects}
            onUpdate={updateProjects}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        );
      case 6:
        return (
          <ReviewForm
            cvData={cvData}
            completionPercentage={completionPercentage}
            onPrevious={previousStep}
            onDownload={() => console.log("Download CV")}
            onEditSection={goToStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 py-2 mb-6">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="text-blue-700 font-medium text-sm">
              {t("pageTitle")}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t("heroTitle")}
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {t("heroTitleHighlight")}
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("heroSubtitle")}
          </p>
        </div>

        {/* Progress Steps */}
        <StepIndicator steps={steps} currentStep={currentStep} />

        {/* Save Status Indicator */}
        <div className="flex justify-center mb-6">
          <SaveStatusIndicator
            isDataLoaded={isDataLoaded}
            lastUpdated={cvData.updatedAt}
            onClearData={clearSavedData}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">{renderCurrentStep()}</div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <CVPreview
              personalInfo={cvData.personalInfo}
              workExperience={cvData.workExperience}
              education={cvData.education}
              skills={cvData.skills}
              projects={cvData.projects}
              completionPercentage={completionPercentage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
