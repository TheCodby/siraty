"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  FolderOpen,
  ExternalLink,
  Github,
  X,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";
import { getObjectErrors } from "@/lib/validations/cv";
import type { Project } from "@/types";

// More lenient validation schema for the form UI
const formProjectSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, "Project name is required")
    .min(2, "Project name must be at least 2 characters")
    .max(100, "Project name must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Project description is required")
    .min(10, "Description should be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  technologies: z.array(z.string()).default([]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  link: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value || value.trim() === "") return true;
        return /^https?:\/\/.+\..+/.test(value);
      },
      { message: "Please enter a valid URL" }
    ),
  repository: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value || value.trim() === "") return true;
        return /^https:\/\/(www\.)?(github|gitlab|bitbucket)\.com\/.+/.test(
          value
        );
      },
      { message: "Please enter a valid repository URL" }
    ),
});

interface ProjectsFormProps {
  data: Project[];
  onUpdate: (projects: Project[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const ProjectsForm: React.FC<ProjectsFormProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
}) => {
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>(
    {}
  );
  const [techInputs, setTechInputs] = useState<Record<string, string>>({});
  const t = useTranslations("cvBuilder.projects");
  const tCommon = useTranslations("common");
  const tSteps = useTranslations("cvBuilder.steps");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const validateSingleProject = (project: Project): Record<string, string> => {
    try {
      formProjectSchema.parse(project);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        return getObjectErrors(error);
      }
      return {};
    }
  };

  const validateAllProjects = (): boolean => {
    const newErrors: Record<string, Record<string, string>> = {};
    let hasErrors = false;

    // Filter out completely empty projects (only validate projects that have some content)
    const projectsWithContent = data.filter((project) => {
      return (
        project.name.trim() !== "" ||
        project.description.trim() !== "" ||
        project.technologies.length > 0 ||
        project.startDate.trim() !== "" ||
        project.link?.trim() !== "" ||
        project.repository?.trim() !== ""
      );
    });

    // If no projects have content, allow progression (projects are optional)
    if (projectsWithContent.length === 0) {
      setErrors({});
      return true;
    }

    // Only validate projects that have some content entered
    projectsWithContent.forEach((project) => {
      const projectErrors = validateSingleProject(project);
      if (Object.keys(projectErrors).length > 0) {
        newErrors[project.id] = projectErrors;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const addNewProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: [],
      startDate: "",
      endDate: "",
      link: "",
      repository: "",
    };
    onUpdate([...data, newProject]);
  };

  const updateProject = (
    id: string,
    field: keyof Project,
    value: string | string[]
  ) => {
    const updatedProjects = data.map((project) =>
      project.id === id ? { ...project, [field]: value } : project
    );
    onUpdate(updatedProjects);

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

  const removeProject = (id: string) => {
    const updatedProjects = data.filter((project) => project.id !== id);
    onUpdate(updatedProjects);

    // Remove errors for this project
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });

    // Remove tech input for this project
    setTechInputs((prev) => {
      const newInputs = { ...prev };
      delete newInputs[id];
      return newInputs;
    });
  };

  const addTechnology = (projectId: string) => {
    const technology = techInputs[projectId]?.trim();
    if (!technology) return;

    const project = data.find((p) => p.id === projectId);
    if (!project) return;

    const updatedProjects = data.map((project) =>
      project.id === projectId
        ? { ...project, technologies: [...project.technologies, technology] }
        : project
    );
    onUpdate(updatedProjects);

    // Clear the input
    setTechInputs((prev) => ({ ...prev, [projectId]: "" }));
  };

  const removeTechnology = (projectId: string, index: number) => {
    const updatedProjects = data.map((project) =>
      project.id === projectId
        ? {
            ...project,
            technologies: project.technologies.filter((_, i) => i !== index),
          }
        : project
    );
    onUpdate(updatedProjects);
  };

  const handleTechInputChange = (projectId: string, value: string) => {
    setTechInputs((prev) => ({ ...prev, [projectId]: value }));
  };

  const handleTechInputKeyPress = (
    projectId: string,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTechnology(projectId);
    }
  };

  const handleNext = () => {
    // Clean up any completely empty projects before validation
    const cleanedProjects = data.filter((project) => {
      return (
        project.name.trim() !== "" ||
        project.description.trim() !== "" ||
        project.technologies.length > 0 ||
        project.startDate.trim() !== "" ||
        project.link?.trim() !== "" ||
        project.repository?.trim() !== ""
      );
    });
    // Update the data with cleaned projects
    if (cleanedProjects.length !== data.length) {
      onUpdate(cleanedProjects);
    }
    if (validateAllProjects()) {
      onNext();
    } else {
      console.log("errors", errors);
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
          <FolderOpen className="h-5 w-5" />
          {tSteps("projects")}
        </CardTitle>
        <CardDescription>
          {t("description")} {tCommon("optional")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {data.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t("empty.title")}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {t("empty.description")}
            </p>
            <Button onClick={addNewProject} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              {t("addFirst")}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {data.map((project, index) => (
              <Card
                key={project.id}
                className="relative border-l-4 border-l-green-500"
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
                        {t("projectNumber", { number: index + 1 })}
                      </Badge>
                      {project.link && (
                        <Badge variant="secondary" className="text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {t("hasDemo")}
                        </Badge>
                      )}
                      {project.repository && (
                        <Badge variant="secondary" className="text-xs">
                          <Github className="h-3 w-3 mr-1" />
                          {t("hasRepo")}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProject(project.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <FormField
                      label={t("fields.name")}
                      value={project.name}
                      onChange={(value) =>
                        updateProject(project.id, "name", value)
                      }
                      placeholder={t("placeholders.name")}
                      required
                      error={errors[project.id]?.name}
                    />

                    <FormField
                      label={t("fields.duration")}
                      value={project.startDate}
                      onChange={(value) =>
                        updateProject(project.id, "startDate", value)
                      }
                      placeholder={t("placeholders.duration")}
                      error={errors[project.id]?.startDate}
                    />

                    <FormField
                      label={t("fields.demoUrl")}
                      value={project.link || ""}
                      onChange={(value) =>
                        updateProject(project.id, "link", value)
                      }
                      placeholder={t("placeholders.demoUrl")}
                      error={errors[project.id]?.link}
                    />

                    <FormField
                      label={t("fields.repoUrl")}
                      value={project.repository || ""}
                      onChange={(value) =>
                        updateProject(project.id, "repository", value)
                      }
                      placeholder={t("placeholders.repoUrl")}
                      error={errors[project.id]?.repository}
                    />
                  </div>

                  <FormField
                    label={t("fields.description")}
                    type="textarea"
                    value={project.description}
                    onChange={(value) =>
                      updateProject(project.id, "description", value)
                    }
                    placeholder={t("placeholders.description")}
                    required
                    rows={4}
                    error={errors[project.id]?.description}
                    hint={t("hints.description")}
                  />

                  {/* Technologies Section */}
                  <div className="space-y-3">
                    <div
                      className={`flex items-center justify-between ${
                        isRTL ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <h4 className="text-sm font-medium">
                        {t("fields.technologies")}
                      </h4>
                    </div>

                    {/* Technology Input */}
                    <div
                      className={`flex gap-2 ${
                        isRTL ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <Input
                        placeholder={t("placeholders.technology")}
                        value={techInputs[project.id] || ""}
                        onChange={(e) =>
                          handleTechInputChange(project.id, e.target.value)
                        }
                        onKeyPress={(e) =>
                          handleTechInputKeyPress(project.id, e)
                        }
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTechnology(project.id)}
                        disabled={!techInputs[project.id]?.trim()}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        {t("addTech")}
                      </Button>
                    </div>

                    {/* Technology Tags */}
                    {project.technologies.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge
                            key={techIndex}
                            variant="secondary"
                            className="text-xs flex items-center gap-1 pr-1"
                          >
                            {tech}
                            <button
                              onClick={() =>
                                removeTechnology(project.id, techIndex)
                              }
                              className="ml-1 hover:text-destructive rounded-full hover:bg-destructive/10 p-0.5"
                              type="button"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {t("empty.technologies")}
                      </p>
                    )}
                    {errors[project.id]?.technologies && (
                      <p className="text-sm text-destructive">
                        {errors[project.id].technologies}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              onClick={addNewProject}
              className="w-full h-12 border-dashed border-2 hover:border-green-300 hover:bg-green-50"
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
            {tCommon("next")}: {tSteps("review")} →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
