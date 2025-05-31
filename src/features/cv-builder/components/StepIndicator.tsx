"use client";

import React from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

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
  variant?: "default" | "compact" | "minimal";
  showDescription?: boolean;
  className?: string;
  onStepClick?: (stepId: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  variant = "default",
  showDescription = true,
  className,
  onStepClick,
}) => {
  const t = useTranslations("cvBuilder.stepIndicator");

  const getStepStatus = (step: Step) => {
    if (step.id < currentStep) return "completed";
    if (step.id === currentStep) return "current";
    return "upcoming";
  };

  const getStepStyles = (step: Step, status: string) => {
    const baseStyles =
      "relative flex items-center justify-center transition-all duration-300 rounded-full border-2";

    switch (variant) {
      case "compact":
        return cn(baseStyles, "w-8 h-8", {
          "bg-green-600 border-green-600 text-white shadow-lg":
            status === "completed",
          "bg-blue-600 border-blue-600 text-white shadow-lg":
            status === "current",
          "bg-gray-100 border-gray-300 text-gray-400 hover:border-gray-400":
            status === "upcoming",
        });
      case "minimal":
        return cn(baseStyles, "w-6 h-6", {
          "bg-green-500 border-green-500": status === "completed",
          "bg-blue-500 border-blue-500": status === "current",
          "bg-gray-200 border-gray-200": status === "upcoming",
        });
      default:
        return cn(baseStyles, "w-12 h-12", {
          "bg-gradient-to-br from-green-500 to-green-600 border-green-600 text-white shadow-lg hover:shadow-xl":
            status === "completed",
          "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-600 text-white shadow-lg hover:shadow-xl":
            status === "current",
          "bg-white border-gray-300 text-gray-400 hover:border-blue-300 hover:text-blue-500":
            status === "upcoming",
        });
    }
  };

  const getTextStyles = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "current":
        return "text-blue-600 font-semibold";
      default:
        return "text-gray-500";
    }
  };

  const getConnectorStyles = (stepIndex: number) => {
    const isCompleted = stepIndex < currentStep - 1;

    const colorStyles = isCompleted
      ? "bg-gradient-to-r from-green-500 to-green-600"
      : "bg-gray-200";

    return cn(
      "flex-1 h-0.5 transition-all duration-300 self-center",
      colorStyles,
      {
        "hidden sm:block": variant === "compact",
        hidden: variant === "minimal",
      }
    );
  };

  const renderStepIcon = (step: Step, status: string) => {
    const IconComponent = step.icon;
    const iconSize =
      variant === "minimal"
        ? "w-3 h-3"
        : variant === "compact"
        ? "w-4 h-4"
        : "w-6 h-6";

    if (status === "completed") {
      return <CheckIcon className={iconSize} />;
    }

    return <IconComponent className={iconSize} />;
  };

  const handleStepClick = (step: Step) => {
    if (
      onStepClick &&
      (step.status === "completed" || step.status === "current")
    ) {
      onStepClick(step.id);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Steps Container */}
      <div
        className={cn(
          "flex items-center max-w-4xl mx-auto",
          variant === "minimal" && "space-x-2 rtl:space-x-reverse"
        )}
      >
        {steps.map((step, index) => {
          const status = getStepStatus(step);
          const isClickable =
            onStepClick && (status === "completed" || status === "current");

          return (
            <React.Fragment key={step.id}>
              {/* Step Container */}
              <div
                className={cn(
                  "flex flex-col items-center group",
                  variant === "minimal" ? "flex-1" : "flex-shrink-0",
                  isClickable && "cursor-pointer"
                )}
                onClick={() => handleStepClick(step)}
                role={isClickable ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                aria-label={`${t("step")} ${step.id}: ${step.name} - ${t(
                  status
                )}`}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    handleStepClick(step);
                  }
                }}
              >
                {/* Step Circle */}
                <div className={getStepStyles(step, status)}>
                  {renderStepIcon(step, status)}
                </div>

                {/* Step Info */}
                {variant !== "minimal" && (
                  <div
                    className={cn(
                      "mt-3 text-center",
                      variant === "compact" ? "max-w-16" : "max-w-24"
                    )}
                  >
                    <p
                      className={cn(
                        "text-sm font-medium transition-colors",
                        getTextStyles(status)
                      )}
                    >
                      {variant === "compact"
                        ? step.id
                        : `${t("step")} ${step.id}`}
                    </p>
                    <p
                      className={cn(
                        "text-xs mt-1 transition-colors",
                        getTextStyles(status),
                        "hidden sm:block"
                      )}
                    >
                      {step.name}
                    </p>
                    {showDescription && variant === "default" && (
                      <p className="text-xs text-gray-400 mt-1 hidden md:block">
                        {step.description}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Connector Line - only show between steps, not after the last one */}
              {index < steps.length - 1 && (
                <div className={getConnectorStyles(index)} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile Step Info */}
      {variant === "default" && (
        <div className="sm:hidden mt-6 text-center">
          {steps.map((step) => {
            const status = getStepStatus(step);
            if (status === "current") {
              return (
                <div
                  key={step.id}
                  className="bg-blue-50 rounded-lg p-4 border border-blue-200"
                >
                  <h3 className="font-semibold text-blue-900 mb-1">
                    {t("step")} {step.id}: {step.name}
                  </h3>
                  <p className="text-sm text-blue-700">{step.description}</p>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};
