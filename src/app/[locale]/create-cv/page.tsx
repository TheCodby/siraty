"use client";

import {
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Download,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import {
  StepIndicator,
  type Step,
} from "@/features/cv-builder/components/StepIndicator";
import { PersonalInfoForm } from "@/features/cv-builder/components/PersonalInfoForm";
import { WorkExperienceForm } from "@/features/cv-builder/components/WorkExperienceForm";
import { EducationForm } from "@/features/cv-builder/components/EducationForm";
import { SkillsProjectsForm } from "@/features/cv-builder/components/SkillsProjectsForm";
import { ReviewForm } from "@/features/cv-builder/components/ReviewForm";
import { CVPreview } from "@/features/cv-builder/components/CVPreview";
import { useCVBuilder } from "@/features/cv-builder/hooks/useCVBuilder";

const steps: Step[] = [
  {
    id: 1,
    name: "Personal Information",
    description: "Basic contact details and summary",
    icon: User,
    status: "current",
  },
  {
    id: 2,
    name: "Work Experience",
    description: "Professional experience and achievements",
    icon: Briefcase,
    status: "upcoming",
  },
  {
    id: 3,
    name: "Education",
    description: "Academic background and qualifications",
    icon: GraduationCap,
    status: "upcoming",
  },
  {
    id: 4,
    name: "Skills & Projects",
    description: "Technical skills and notable projects",
    icon: Code,
    status: "upcoming",
  },
  {
    id: 5,
    name: "Review & Download",
    description: "Final review and export options",
    icon: Download,
    status: "upcoming",
  },
];

export default function CreateCVPage() {
  const {
    currentStep,
    cvData,
    completionPercentage,
    updatePersonalInfo,
    updateWorkExperience,
    updateEducation,
    updateSkills,
    updateProjects,
    nextStep,
    previousStep,
    goToStep,
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
          <SkillsProjectsForm
            skills={cvData.skills}
            projects={cvData.projects}
            onUpdateSkills={updateSkills}
            onUpdateProjects={updateProjects}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        );
      case 5:
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 py-2 mb-6">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="text-blue-700 font-medium text-sm">
              CV Builder
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Create Your
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Professional CV
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Build a stunning, ATS-optimized resume in minutes with our
            AI-powered guidance
          </p>
        </div>

        {/* Progress Steps */}
        <StepIndicator steps={steps} currentStep={currentStep} />

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
