"use client";

import { useState } from "react";
import { Plus, Trash2, Building } from "lucide-react";
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
import { workExperienceSchema, getObjectErrors } from "@/lib/validations/cv";
import type { WorkExperience } from "@/types";

interface WorkExperienceFormProps {
  data: WorkExperience[];
  onUpdate: (data: WorkExperience[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
}) => {
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>(
    {}
  );

  const validateSingleExperience = (
    experience: WorkExperience
  ): Record<string, string> => {
    try {
      workExperienceSchema.parse(experience);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        return getObjectErrors(error);
      }
      return {};
    }
  };

  const validateAllExperiences = (): boolean => {
    // Check if there's at least one experience
    if (data.length === 0) {
      return false;
    }

    // Validate each individual experience
    const newErrors: Record<string, Record<string, string>> = {};
    let hasErrors = false;

    data.forEach((experience) => {
      const experienceErrors = validateSingleExperience(experience);
      if (Object.keys(experienceErrors).length > 0) {
        newErrors[experience.id] = experienceErrors;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const addNewExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrentRole: false,
      description: "",
      achievements: [],
      technologies: [],
    };

    onUpdate([...data, newExperience]);
  };

  const updateExperience = (
    id: string,
    field: keyof WorkExperience,
    value: string | boolean | string[]
  ) => {
    const updatedData = data.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
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

  const removeExperience = (id: string) => {
    const updatedData = data.filter((exp) => exp.id !== id);
    onUpdate(updatedData);

    // Remove errors for this experience
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const handleNext = () => {
    if (validateAllExperiences()) {
      onNext();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Work Experience
        </CardTitle>
        <CardDescription>
          Add your professional experience, starting with your most recent role
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {data.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No work experience added yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Add your first work experience to get started
            </p>
            <Button onClick={addNewExperience}>
              <Plus className="h-4 w-4 mr-2" />
              Add Work Experience
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {data.map((experience, index) => (
              <Card key={experience.id} className="relative">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Experience {index + 1}</Badge>
                      {experience.isCurrentRole && (
                        <Badge variant="default">Current Role</Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(experience.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Job Title"
                      value={experience.jobTitle}
                      onChange={(value) =>
                        updateExperience(experience.id, "jobTitle", value)
                      }
                      placeholder="e.g. Senior Software Engineer"
                      required
                      error={errors[experience.id]?.jobTitle}
                    />

                    <FormField
                      label="Company"
                      value={experience.company}
                      onChange={(value) =>
                        updateExperience(experience.id, "company", value)
                      }
                      placeholder="e.g. Tech Company Inc."
                      required
                      error={errors[experience.id]?.company}
                    />

                    <FormField
                      label="Location"
                      value={experience.location}
                      onChange={(value) =>
                        updateExperience(experience.id, "location", value)
                      }
                      placeholder="e.g. New York, NY"
                      required
                      error={errors[experience.id]?.location}
                    />

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`current-${experience.id}`}
                        checked={experience.isCurrentRole}
                        onChange={(e) =>
                          updateExperience(
                            experience.id,
                            "isCurrentRole",
                            e.target.checked
                          )
                        }
                        className="rounded border-input"
                      />
                      <label
                        htmlFor={`current-${experience.id}`}
                        className="text-sm font-medium"
                      >
                        I currently work here
                      </label>
                    </div>

                    <FormField
                      label="Start Date"
                      value={experience.startDate}
                      onChange={(value) =>
                        updateExperience(experience.id, "startDate", value)
                      }
                      placeholder="e.g. January 2022"
                      required
                      error={errors[experience.id]?.startDate}
                    />

                    {!experience.isCurrentRole && (
                      <FormField
                        label="End Date"
                        value={experience.endDate || ""}
                        onChange={(value) =>
                          updateExperience(experience.id, "endDate", value)
                        }
                        placeholder="e.g. December 2023"
                        required
                        error={errors[experience.id]?.endDate}
                      />
                    )}
                  </div>

                  <FormField
                    label="Job Description"
                    type="textarea"
                    value={experience.description}
                    onChange={(value) =>
                      updateExperience(experience.id, "description", value)
                    }
                    placeholder="Describe your role, responsibilities, and key accomplishments..."
                    required
                    rows={4}
                    error={errors[experience.id]?.description}
                    hint="Focus on your impact and achievements using action verbs and quantifiable results"
                  />
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              onClick={addNewExperience}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Work Experience
            </Button>
          </div>
        )}

        <Separator />

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrevious}>
            Previous
          </Button>

          <Button onClick={handleNext}>Next: Education →</Button>
        </div>
      </CardContent>
    </Card>
  );
};
