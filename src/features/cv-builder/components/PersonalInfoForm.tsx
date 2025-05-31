"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FormField } from "./FormField";
import { personalInfoSchema, getObjectErrors } from "@/lib/validations/cv";
import type { PersonalInfo } from "@/types";

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onUpdate: (data: PersonalInfo) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep?: boolean;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isFirstStep = false,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const t = useTranslations("cvBuilder.personalInfo");
  const cvBuilder = useTranslations("cvBuilder");
  const tCommon = useTranslations("common");
  const tSteps = useTranslations("cvBuilder.steps");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const validateForm = (): boolean => {
    try {
      personalInfoSchema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = getObjectErrors(error);
        setErrors(validationErrors);
      }
      return false;
    }
  };

  const handleFieldChange = (field: keyof PersonalInfo, value: string) => {
    const updatedData = { ...data, [field]: value };
    onUpdate(updatedData);

    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={`flex items-center gap-2 ${
            isRTL ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <User className="h-5 w-5" />
          {tSteps("personal")}
        </CardTitle>
        <CardDescription>{cvBuilder("description")}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* LinkedIn Import Section */}

        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          <FormField
            label={t("fullName")}
            value={data.fullName}
            onChange={(value) => handleFieldChange("fullName", value)}
            placeholder={t("placeholders.fullName")}
            required
            error={errors.fullName}
          />

          <FormField
            label={t("email")}
            type="email"
            value={data.email}
            onChange={(value) => handleFieldChange("email", value)}
            placeholder={t("placeholders.email")}
            required
            error={errors.email}
          />

          <FormField
            label={t("phone")}
            type="tel"
            value={data.phone}
            onChange={(value) => handleFieldChange("phone", value)}
            placeholder={t("placeholders.phone")}
            required
            error={errors.phone}
          />

          <FormField
            label={t("location")}
            value={data.location}
            onChange={(value) => handleFieldChange("location", value)}
            placeholder={t("placeholders.location")}
            required
            error={errors.location}
          />

          <FormField
            label={t("linkedIn")}
            value={data.linkedIn || ""}
            onChange={(value) => handleFieldChange("linkedIn", value)}
            placeholder={t("placeholders.linkedIn")}
            error={errors.linkedIn}
          />

          <FormField
            label={t("portfolio")}
            value={data.portfolio || ""}
            onChange={(value) => handleFieldChange("portfolio", value)}
            placeholder={t("placeholders.portfolio")}
            error={errors.portfolio}
          />
        </div>

        <FormField
          label={t("summary")}
          type="textarea"
          value={data.summary}
          onChange={(value) => handleFieldChange("summary", value)}
          placeholder={t("placeholders.summary")}
          required
          rows={4}
          error={errors.summary}
          hint={t("hints.summary")}
        />

        <Separator />

        {/* Navigation Buttons */}
        <div
          className={`flex justify-between pt-4 ${
            isRTL ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <Button variant="outline" onClick={onPrevious} disabled={isFirstStep}>
            {tCommon("previous")}
          </Button>

          <Button onClick={handleNext}>
            {tCommon("next")}: {tSteps("experience")} →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
