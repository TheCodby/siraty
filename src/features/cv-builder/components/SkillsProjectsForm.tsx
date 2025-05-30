"use client";

import { useState } from "react";
import { Plus, Trash2, Code, FolderOpen } from "lucide-react";
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
import {
  skillSchema,
  projectSchema,
  getObjectErrors,
} from "@/lib/validations/cv";
import type { Skill, Project } from "@/types";

interface SkillsProjectsFormProps {
  skills: Skill[];
  projects: Project[];
  onUpdateSkills: (skills: Skill[]) => void;
  onUpdateProjects: (projects: Project[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const SkillsProjectsForm: React.FC<SkillsProjectsFormProps> = ({
  skills,
  projects,
  onUpdateSkills,
  onUpdateProjects,
  onNext,
  onPrevious,
}) => {
  const [errors, setErrors] = useState<{
    skills: Record<string, Record<string, string>>;
    projects: Record<string, Record<string, string>>;
  }>({
    skills: {},
    projects: {},
  });
  const [activeTab, setActiveTab] = useState<"skills" | "projects">("skills");

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

  const validateSingleProject = (project: Project): Record<string, string> => {
    try {
      projectSchema.parse(project);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        return getObjectErrors(error);
      }
      return {};
    }
  };

  // Skills management
  const addNewSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      level: "beginner" as const,
      category: "technical" as const,
    };
    onUpdateSkills([...skills, newSkill]);
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    const updatedSkills = skills.map((skill) =>
      skill.id === id ? { ...skill, [field]: value } : skill
    );
    onUpdateSkills(updatedSkills);

    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (newErrors.skills[id]) {
        const updatedFieldErrors = { ...newErrors.skills[id] };
        delete updatedFieldErrors[field as string];
        newErrors.skills[id] = updatedFieldErrors;
      }
      return newErrors;
    });
  };

  const removeSkill = (id: string) => {
    const updatedSkills = skills.filter((skill) => skill.id !== id);
    onUpdateSkills(updatedSkills);

    // Remove errors for this skill
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.skills[id];
      return newErrors;
    });
  };

  // Projects management
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
    onUpdateProjects([...projects, newProject]);
  };

  const updateProject = (
    id: string,
    field: keyof Project,
    value: string | string[]
  ) => {
    const updatedProjects = projects.map((project) =>
      project.id === id ? { ...project, [field]: value } : project
    );
    onUpdateProjects(updatedProjects);

    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (newErrors.projects[id]) {
        const updatedFieldErrors = { ...newErrors.projects[id] };
        delete updatedFieldErrors[field as string];
        newErrors.projects[id] = updatedFieldErrors;
      }
      return newErrors;
    });
  };

  const removeProject = (id: string) => {
    const updatedProjects = projects.filter((project) => project.id !== id);
    onUpdateProjects(updatedProjects);

    // Remove errors for this project
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.projects[id];
      return newErrors;
    });
  };

  const addTechnology = (projectId: string, technology: string) => {
    if (!technology.trim()) return;

    const updatedProjects = projects.map((project) =>
      project.id === projectId
        ? { ...project, technologies: [...project.technologies, technology] }
        : project
    );
    onUpdateProjects(updatedProjects);
  };

  const removeTechnology = (projectId: string, index: number) => {
    const updatedProjects = projects.map((project) =>
      project.id === projectId
        ? {
            ...project,
            technologies: project.technologies.filter((_, i) => i !== index),
          }
        : project
    );
    onUpdateProjects(updatedProjects);
  };

  const validateAll = (): boolean => {
    // Check if there's at least one skill
    if (skills.length === 0) {
      return false;
    }

    // Validate each individual skill and project
    const newErrors: {
      skills: Record<string, Record<string, string>>;
      projects: Record<string, Record<string, string>>;
    } = { skills: {}, projects: {} };
    let hasErrors = false;

    skills.forEach((skill) => {
      const skillErrors = validateSingleSkill(skill);
      if (Object.keys(skillErrors).length > 0) {
        newErrors.skills[skill.id] = skillErrors;
        hasErrors = true;
      }
    });

    projects.forEach((project) => {
      const projectErrors = validateSingleProject(project);
      if (Object.keys(projectErrors).length > 0) {
        newErrors.projects[project.id] = projectErrors;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleNext = () => {
    if (validateAll()) {
      onNext();
    }
  };

  const skillLevels = ["beginner", "intermediate", "advanced", "expert"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Skills & Projects
        </CardTitle>
        <CardDescription>
          Showcase your technical skills and notable projects
        </CardDescription>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <button
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "skills"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("skills")}
          >
            <Code className="h-4 w-4 mr-2 inline" />
            Skills
          </button>
          <button
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "projects"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("projects")}
          >
            <FolderOpen className="h-4 w-4 mr-2 inline" />
            Projects
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {activeTab === "skills" && (
          <div className="space-y-6">
            {skills.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No skills added yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Add your technical and professional skills
                </p>
                <Button onClick={addNewSkill}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <Card key={skill.id} className="relative">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline">Skill {index + 1}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(skill.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          label="Skill Name"
                          value={skill.name}
                          onChange={(value) =>
                            updateSkill(skill.id, "name", value)
                          }
                          placeholder="e.g. JavaScript"
                          required
                          error={errors.skills[skill.id]?.name}
                        />

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Level <span className="text-destructive">*</span>
                          </label>
                          <select
                            className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md"
                            value={skill.level}
                            onChange={(e) =>
                              updateSkill(skill.id, "level", e.target.value)
                            }
                          >
                            <option value="">Select level</option>
                            {skillLevels.map((level) => (
                              <option key={level} value={level}>
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                              </option>
                            ))}
                          </select>
                          {errors.skills[skill.id]?.level && (
                            <p className="text-sm text-destructive">
                              {errors.skills[skill.id]?.level}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Category <span className="text-destructive">*</span>
                          </label>
                          <select
                            className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md"
                            value={skill.category}
                            onChange={(e) =>
                              updateSkill(skill.id, "category", e.target.value)
                            }
                          >
                            <option value="">Select category</option>
                            <option value="technical">Technical</option>
                            <option value="soft">Soft Skills</option>
                            <option value="language">Language</option>
                          </select>
                          {errors.skills[skill.id]?.category && (
                            <p className="text-sm text-destructive">
                              {errors.skills[skill.id]?.category}
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
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Skill
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-6">
            {projects.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No projects added yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Showcase your notable projects and achievements
                </p>
                <Button onClick={addNewProject}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {projects.map((project, index) => (
                  <Card key={project.id} className="relative">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">Project {index + 1}</Badge>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="Project Name"
                          value={project.name}
                          onChange={(value) =>
                            updateProject(project.id, "name", value)
                          }
                          placeholder="e.g. E-commerce Platform"
                          required
                          error={errors.projects[project.id]?.name}
                        />

                        <FormField
                          label="Project URL (Optional)"
                          value={project.link || ""}
                          onChange={(value) =>
                            updateProject(project.id, "link", value)
                          }
                          placeholder="https://project-demo.com"
                          error={errors.projects[project.id]?.link}
                        />

                        <FormField
                          label="GitHub URL (Optional)"
                          value={project.repository || ""}
                          onChange={(value) =>
                            updateProject(project.id, "repository", value)
                          }
                          placeholder="https://github.com/username/project"
                          error={errors.projects[project.id]?.repository}
                        />

                        <FormField
                          label="Duration"
                          value={project.startDate}
                          onChange={(value) =>
                            updateProject(project.id, "startDate", value)
                          }
                          placeholder="e.g. Jan 2023 - Mar 2023"
                          error={errors.projects[project.id]?.startDate}
                        />
                      </div>

                      <FormField
                        label="Project Description"
                        type="textarea"
                        value={project.description}
                        onChange={(value) =>
                          updateProject(project.id, "description", value)
                        }
                        placeholder="Describe the project, your role, and key achievements..."
                        required
                        rows={3}
                        error={errors.projects[project.id]?.description}
                      />

                      {/* Technologies Section */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">
                            Technologies Used
                          </h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const tech = prompt("Enter a technology:");
                              if (tech) {
                                addTechnology(project.id, tech);
                              }
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Technology
                          </Button>
                        </div>

                        {project.technologies.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, techIndex) => (
                              <Badge
                                key={techIndex}
                                variant="secondary"
                                className="text-xs flex items-center gap-1"
                              >
                                {tech}
                                <button
                                  onClick={() =>
                                    removeTechnology(project.id, techIndex)
                                  }
                                  className="ml-1 hover:text-destructive"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No technologies added yet
                          </p>
                        )}
                        {errors.projects[project.id]?.technologies && (
                          <p className="text-sm text-destructive">
                            {errors.projects[project.id].technologies}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  variant="outline"
                  onClick={addNewProject}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Project
                </Button>
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrevious}>
            Previous
          </Button>

          <Button onClick={handleNext}>Next: Review →</Button>
        </div>
      </CardContent>
    </Card>
  );
};
