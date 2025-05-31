"use client";

import { useState } from "react";
import { Plus, Trash2, Code, Star } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FormField } from "./FormField";
import { skillSchema, getObjectErrors } from "@/lib/validations/cv";
import type { Skill } from "@/types";

interface SkillsFormProps {
  data: Skill[];
  onUpdate: (skills: Skill[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
}) => {
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>(
    {}
  );
  const t = useTranslations("cvBuilder.skills");
  const tCommon = useTranslations("common");
  const tSteps = useTranslations("cvBuilder.steps");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const validateSingleSkill = (skill: Skill): Record<string, string> => {
    try {
      skillSchema.parse(skill);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        return getObjectErrors(error);
      }
      return {};
    }
  };

  const validateAllSkills = (): boolean => {
    if (data.length === 0) {
      return false;
    }

    const newErrors: Record<string, Record<string, string>> = {};
    let hasErrors = false;

    data.forEach((skill) => {
      const skillErrors = validateSingleSkill(skill);
      if (Object.keys(skillErrors).length > 0) {
        newErrors[skill.id] = skillErrors;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const addNewSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      level: "beginner" as const,
      category: "technical" as const,
    };
    onUpdate([...data, newSkill]);
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    const updatedSkills = data.map((skill) =>
      skill.id === id ? { ...skill, [field]: value } : skill
    );
    onUpdate(updatedSkills);

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

  const removeSkill = (id: string) => {
    const updatedSkills = data.filter((skill) => skill.id !== id);
    onUpdate(updatedSkills);

    // Remove errors for this skill
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const handleNext = () => {
    if (validateAllSkills()) {
      onNext();
    }
  };

  const skillLevels = [
    { value: "beginner", label: t("levels.beginner"), stars: 1 },
    { value: "intermediate", label: t("levels.intermediate"), stars: 2 },
    { value: "advanced", label: t("levels.advanced"), stars: 3 },
    { value: "expert", label: t("levels.expert"), stars: 4 },
  ];

  const skillCategories = [
    { value: "technical", label: t("categories.technical") },
    { value: "soft", label: t("categories.soft") },
    { value: "language", label: t("categories.language") },
  ];

  const renderStars = (level: string) => {
    const levelData = skillLevels.find((l) => l.value === level);
    if (!levelData) return null;

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <Star
            key={index}
            className={`h-3 w-3 ${
              index < levelData.stars
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={`flex items-center gap-2 ${
            isRTL ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <Code className="h-5 w-5" />
          {tSteps("skills")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {data.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <Code className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t("empty.title")}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {t("empty.description")}
            </p>
            <Button onClick={addNewSkill} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              {t("addFirst")}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((skill, index) => (
              <Card
                key={skill.id}
                className="relative border-l-4 border-l-blue-500"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`flex items-center justify-between ${
                      isRTL ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 ${
                        isRTL ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <Badge variant="outline">
                        {t("skillNumber", { number: index + 1 })}
                      </Badge>
                      {skill.level && renderStars(skill.level)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(skill.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div
                    className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <FormField
                      label={t("fields.name")}
                      value={skill.name}
                      onChange={(value) => updateSkill(skill.id, "name", value)}
                      placeholder={t("placeholders.name")}
                      required
                      error={errors[skill.id]?.name}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        {t("fields.level")}
                        <span className="text-destructive ml-1">*</span>
                      </label>
                      <select
                        className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                        value={skill.level}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          updateSkill(skill.id, "level", e.target.value)
                        }
                      >
                        <option value="">{t("placeholders.level")}</option>
                        {skillLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                      {errors[skill.id]?.level && (
                        <p className="text-sm text-destructive">
                          {errors[skill.id]?.level}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        {t("fields.category")}
                        <span className="text-destructive ml-1">*</span>
                      </label>
                      <select
                        className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                        value={skill.category}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          updateSkill(skill.id, "category", e.target.value)
                        }
                      >
                        <option value="">{t("placeholders.category")}</option>
                        {skillCategories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                      {errors[skill.id]?.category && (
                        <p className="text-sm text-destructive">
                          {errors[skill.id]?.category}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              onClick={addNewSkill}
              className="w-full h-12 border-dashed border-2 hover:border-blue-300 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("addAnother")}
            </Button>
          </div>
        )}

        <Separator />

        {/* Navigation Buttons */}
        <div
          className={`flex justify-between pt-4 ${
            isRTL ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <Button variant="outline" onClick={onPrevious}>
            {tCommon("previous")}
          </Button>

          <Button onClick={handleNext}>
            {tCommon("next")}: {tSteps("projects")} →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
