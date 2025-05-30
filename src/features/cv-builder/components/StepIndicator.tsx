"use client";

import {
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Settings,
  Check,
} from "lucide-react";

export interface Step {
  id: number;
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  status: "completed" | "current" | "upcoming";
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const stepIcons = {
  1: User,
  2: Briefcase,
  3: GraduationCap,
  4: Settings,
  5: FileText,
};

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, stepIdx) => {
          const StepIcon = stepIcons[step.id as keyof typeof stepIcons];
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div
              key={step.id}
              className="relative flex flex-col items-center group"
            >
              {/* Step Circle */}
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-green-600 border-green-600 text-white"
                    : isCurrent
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-muted-foreground/30 text-muted-foreground group-hover:border-primary/50"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-6 w-6" />
                ) : (
                  <StepIcon className="h-6 w-6" />
                )}
              </div>

              {/* Step Info */}
              <div className="mt-3 text-center max-w-24">
                <p
                  className={`text-sm font-medium ${
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Step {step.id}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {step.name}
                </p>
              </div>

              {/* Connector Line */}
              {stepIdx < steps.length - 1 && (
                <div
                  className={`absolute top-6 left-12 w-16 h-0.5 transition-all duration-300 hidden sm:block ${
                    isCompleted ? "bg-green-600" : "bg-muted-foreground/30"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
