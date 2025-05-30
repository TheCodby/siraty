"use client";

import { useState } from "react";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { z } from "zod";
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
import { FormField } from "./FormField";
import { educationSchema, getObjectErrors } from "@/lib/validations/cv";
import type { Education } from "@/types";

interface EducationFormProps {
  data: Education[];
  onUpdate: (data: Education[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
}) => {
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>(
    {}
  );

  const validateSingleEducation = (
    education: Education
  ): Record<string, string> => {
    try {
      educationSchema.parse(education);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        return getObjectErrors(error);
      }
      return {};
    }
  };

  const validateAllEducation = (): boolean => {
    // Check if there's at least one education entry
    if (data.length === 0) {
      return false;
    }

    // Validate each individual education entry
    const newErrors: Record<string, Record<string, string>> = {};
    let hasErrors = false;

    data.forEach((education) => {
      const educationErrors = validateSingleEducation(education);
      if (Object.keys(educationErrors).length > 0) {
        newErrors[education.id] = educationErrors;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const addNewEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      location: "",
      graduationDate: "",
      gpa: "",
      honors: [],
      relevantCourses: [],
    };

    onUpdate([...data, newEducation]);
  };

  const updateEducation = (
    id: string,
    field: keyof Education,
    value: string | string[]
  ) => {
    const updatedData = data.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onUpdate(updatedData);

    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (newErrors[id]) {
        const updatedFieldErrors = { ...newErrors[id] };
        delete updatedFieldErrors[field as string];
        newErrors[id] = updatedFieldErrors;
      }
      return newErrors;
    });
  };

  const removeEducation = (id: string) => {
    const updatedData = data.filter((edu) => edu.id !== id);
    onUpdate(updatedData);

    // Remove errors for this education
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const handleNext = () => {
    if (validateAllEducation()) {
      onNext();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Education
        </CardTitle>
        <CardDescription>
          Add your educational background, starting with your highest
          qualification
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {data.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No education added yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Add your educational qualifications to get started
            </p>
            <Button onClick={addNewEducation}>
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {data.map((education, index) => (
              <Card key={education.id} className="relative">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Education {index + 1}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(education.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Degree/Qualification"
                      value={education.degree}
                      onChange={(value) =>
                        updateEducation(education.id, "degree", value)
                      }
                      placeholder="e.g. Bachelor of Computer Science"
                      required
                      error={errors[education.id]?.degree}
                    />

                    <FormField
                      label="Institution"
                      value={education.institution}
                      onChange={(value) =>
                        updateEducation(education.id, "institution", value)
                      }
                      placeholder="e.g. University of Technology"
                      required
                      error={errors[education.id]?.institution}
                    />

                    <FormField
                      label="Location"
                      value={education.location}
                      onChange={(value) =>
                        updateEducation(education.id, "location", value)
                      }
                      placeholder="e.g. New York, NY"
                      required
                      error={errors[education.id]?.location}
                    />

                    <FormField
                      label="Graduation Date"
                      value={education.graduationDate}
                      onChange={(value) =>
                        updateEducation(education.id, "graduationDate", value)
                      }
                      placeholder="e.g. May 2020"
                      required
                      error={errors[education.id]?.graduationDate}
                    />

                    <FormField
                      label="GPA (Optional)"
                      value={education.gpa || ""}
                      onChange={(value) =>
                        updateEducation(education.id, "gpa", value)
                      }
                      placeholder="e.g. 3.8/4.0"
                      error={errors[education.id]?.gpa}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              onClick={addNewEducation}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Education
            </Button>
          </div>
        )}

        <Separator />

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrevious}>
            Previous
          </Button>

          <Button onClick={handleNext}>Next: Skills & Projects →</Button>
        </div>
      </CardContent>
    </Card>
  );
};
