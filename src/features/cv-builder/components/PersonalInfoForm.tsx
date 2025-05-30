"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { z } from "zod";
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
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
        <CardDescription>
          Tell us about yourself and add your contact details
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Full Name"
            value={data.fullName}
            onChange={(value) => handleFieldChange("fullName", value)}
            placeholder="e.g. John Doe"
            required
            error={errors.fullName}
          />

          <FormField
            label="Email"
            type="email"
            value={data.email}
            onChange={(value) => handleFieldChange("email", value)}
            placeholder="e.g. john.doe@example.com"
            required
            error={errors.email}
          />

          <FormField
            label="Phone"
            type="tel"
            value={data.phone}
            onChange={(value) => handleFieldChange("phone", value)}
            placeholder="e.g. +1 (555) 123-4567"
            required
            error={errors.phone}
          />

          <FormField
            label="Location"
            value={data.location}
            onChange={(value) => handleFieldChange("location", value)}
            placeholder="e.g. New York, NY"
            required
            error={errors.location}
          />

          <FormField
            label="LinkedIn Profile"
            value={data.linkedIn || ""}
            onChange={(value) => handleFieldChange("linkedIn", value)}
            placeholder="e.g. https://linkedin.com/in/johndoe"
            error={errors.linkedIn}
          />

          <FormField
            label="Portfolio Website"
            value={data.portfolio || ""}
            onChange={(value) => handleFieldChange("portfolio", value)}
            placeholder="e.g. https://johndoe.com"
            error={errors.portfolio}
          />
        </div>

        <FormField
          label="Professional Summary"
          type="textarea"
          value={data.summary}
          onChange={(value) => handleFieldChange("summary", value)}
          placeholder="Write a compelling summary that highlights your key skills, experience, and career goals..."
          required
          rows={4}
          error={errors.summary}
          hint="This is your elevator pitch. Focus on your strengths and what makes you unique."
        />

        <Separator />

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrevious} disabled={isFirstStep}>
            Previous
          </Button>

          <Button onClick={handleNext}>Next: Work Experience →</Button>
        </div>
      </CardContent>
    </Card>
  );
};
