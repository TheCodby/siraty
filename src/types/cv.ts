export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  portfolio?: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrentRole: boolean;
  description: string;
  achievements: string[];
  technologies?: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
  honors?: string[];
  relevantCourses?: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: "technical" | "soft" | "language";
  level: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  link?: string;
  repository?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  link?: string;
}

export interface CVData {
  id: string;
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Array<{
    name: string;
    level: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
