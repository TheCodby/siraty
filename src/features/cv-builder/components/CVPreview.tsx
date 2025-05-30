"use client";

import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type {
  PersonalInfo,
  WorkExperience,
  Education,
  Skill,
  Project,
} from "@/types";

interface CVPreviewProps {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  completionPercentage: number;
}

export const CVPreview: React.FC<CVPreviewProps> = ({
  personalInfo,
  workExperience,
  education,
  skills,
  projects,
  completionPercentage,
}) => {
  const hasPersonalData = Object.values(personalInfo).some(
    (value) => value.trim() !== ""
  );
  const hasWorkData = workExperience.length > 0;
  const hasEducationData = education.length > 0;
  const hasSkillsData = skills.length > 0;
  const hasProjectsData = projects.length > 0;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Live Preview
          <Badge variant="secondary">
            {Math.round(completionPercentage)}% Complete
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-muted rounded-lg p-6 min-h-[400px]">
          {hasPersonalData ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="text-center border-b border-border pb-4">
                {personalInfo.fullName && (
                  <h1 className="text-xl font-bold text-foreground mb-1">
                    {personalInfo.fullName}
                  </h1>
                )}

                <div className="text-sm text-muted-foreground space-y-1">
                  {personalInfo.email && <div>{personalInfo.email}</div>}
                  {personalInfo.phone && <div>{personalInfo.phone}</div>}
                  {personalInfo.location && <div>{personalInfo.location}</div>}
                </div>

                <div className="flex justify-center space-x-4 mt-2">
                  {personalInfo.linkedIn && (
                    <a
                      href={personalInfo.linkedIn}
                      className="text-xs text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                  )}
                  {personalInfo.portfolio && (
                    <a
                      href={personalInfo.portfolio}
                      className="text-xs text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Portfolio
                    </a>
                  )}
                </div>
              </div>

              {/* Summary */}
              {personalInfo.summary && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Professional Summary
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed break-words">
                    {personalInfo.summary}
                  </p>
                </div>
              )}

              {/* Work Experience */}
              {hasWorkData && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Work Experience
                  </h3>
                  <div className="space-y-3">
                    {workExperience.slice(0, 2).map((exp, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-primary/20 pl-3"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-medium text-foreground">
                            {exp.jobTitle}
                          </h4>
                          {exp.isCurrentRole && (
                            <Badge
                              variant="secondary"
                              className="text-xs py-0 px-1"
                            >
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {exp.company} • {exp.location}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {exp.startDate} -{" "}
                          {exp.isCurrentRole ? "Present" : exp.endDate}
                        </p>
                        {exp.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                    {workExperience.length > 2 && (
                      <p className="text-xs text-muted-foreground italic">
                        +{workExperience.length - 2} more experience
                        {workExperience.length > 3 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Education */}
              {hasEducationData && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Education
                  </h3>
                  <div className="space-y-2">
                    {education.slice(0, 2).map((edu, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-primary/20 pl-3"
                      >
                        <h4 className="text-xs font-medium text-foreground">
                          {edu.degree}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {edu.institution} • {edu.location}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {edu.graduationDate}
                          {edu.gpa && ` • GPA: ${edu.gpa}`}
                        </p>
                      </div>
                    ))}
                    {education.length > 2 && (
                      <p className="text-xs text-muted-foreground italic">
                        +{education.length - 2} more education entries
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Skills */}
              {hasSkillsData && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {skills.slice(0, 8).map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill.name}
                      </Badge>
                    ))}
                    {skills.length > 8 && (
                      <Badge variant="outline" className="text-xs">
                        +{skills.length - 8} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Projects */}
              {hasProjectsData && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Projects
                  </h3>
                  <div className="space-y-2">
                    {projects.slice(0, 2).map((project, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-primary/20 pl-3"
                      >
                        <h4 className="text-xs font-medium text-foreground">
                          {project.name}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {project.description}
                        </p>
                        {project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {project.technologies
                              .slice(0, 3)
                              .map((tech, techIndex) => (
                                <Badge
                                  key={techIndex}
                                  variant="outline"
                                  className="text-xs py-0 px-1"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            {project.technologies.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{project.technologies.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {projects.length > 2 && (
                      <p className="text-xs text-muted-foreground italic">
                        +{projects.length - 2} more projects
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Placeholder sections for future steps */}
              {!hasWorkData && !hasEducationData && !hasSkillsData && (
                <div className="space-y-3">
                  <div className="bg-muted-foreground/20 h-4 rounded w-3/4"></div>
                  <div className="bg-muted-foreground/20 h-3 rounded w-full"></div>
                  <div className="bg-muted-foreground/20 h-3 rounded w-5/6"></div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3" />
              <p className="text-sm">
                Your CV preview will appear here as you fill in the form
              </p>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completion</span>
            <span className="font-medium text-primary">
              {Math.round(completionPercentage)}%
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {completionPercentage < 100
              ? "Complete your information to continue"
              : "Your CV is ready!"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
