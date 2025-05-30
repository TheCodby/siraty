import type { CVData, JobDescription, ATSScore, MatchAnalysis } from "@/types";

export const mockCV: CVData = {
  id: "cv-001",
  personalInfo: {
    fullName: "Ahmed Mohammed",
    email: "ahmed.mohammed@email.com",
    phone: "+966 50 123 4567",
    location: "Riyadh, Saudi Arabia",
    linkedIn: "https://linkedin.com/in/ahmed-mohammed",
    portfolio: "https://ahmed-dev.com",
    summary:
      "Experienced Full Stack Developer with 5+ years of expertise in React, Node.js, and cloud technologies. Passionate about building scalable web applications and leading development teams.",
  },
  workExperience: [
    {
      id: "exp-001",
      jobTitle: "Senior Full Stack Developer",
      company: "Tech Solutions KSA",
      location: "Riyadh, SA",
      startDate: "2022-01",
      endDate: undefined,
      isCurrentRole: true,
      description:
        "Lead development of enterprise web applications using React and Node.js",
      achievements: [
        "Improved application performance by 40% through code optimization",
        "Led a team of 4 developers on multiple projects",
        "Implemented CI/CD pipelines reducing deployment time by 60%",
      ],
      technologies: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
    },
    {
      id: "exp-002",
      jobTitle: "Frontend Developer",
      company: "Digital Agency",
      location: "Jeddah, SA",
      startDate: "2020-03",
      endDate: "2021-12",
      isCurrentRole: false,
      description:
        "Developed responsive web applications and mobile-first interfaces",
      achievements: [
        "Built 15+ client websites with 99% customer satisfaction",
        "Reduced page load times by 50% through optimization techniques",
        "Mentored 2 junior developers",
      ],
      technologies: ["React", "Vue.js", "SASS", "JavaScript", "Git"],
    },
  ],
  education: [
    {
      id: "edu-001",
      degree: "Bachelor of Computer Science",
      institution: "King Saud University",
      location: "Riyadh, SA",
      graduationDate: "2019-06",
      gpa: "3.8/4.0",
      honors: ["Magna Cum Laude", "Dean's List"],
      relevantCourses: [
        "Data Structures",
        "Software Engineering",
        "Database Systems",
        "Web Development",
      ],
    },
  ],
  skills: [
    { id: "skill-001", name: "React", category: "technical", level: "expert" },
    {
      id: "skill-002",
      name: "TypeScript",
      category: "technical",
      level: "advanced",
    },
    {
      id: "skill-003",
      name: "Node.js",
      category: "technical",
      level: "advanced",
    },
    {
      id: "skill-004",
      name: "AWS",
      category: "technical",
      level: "intermediate",
    },
    {
      id: "skill-005",
      name: "Leadership",
      category: "soft",
      level: "advanced",
    },
    {
      id: "skill-006",
      name: "Problem Solving",
      category: "soft",
      level: "expert",
    },
    { id: "skill-007", name: "Arabic", category: "language", level: "expert" },
    {
      id: "skill-008",
      name: "English",
      category: "language",
      level: "advanced",
    },
  ],
  projects: [
    {
      id: "proj-001",
      name: "E-commerce Platform",
      description:
        "Full-stack e-commerce solution with React frontend and Node.js backend",
      technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
      startDate: "2023-01",
      endDate: "2023-06",
      link: "https://ecommerce-demo.com",
      repository: "https://github.com/ahmed/ecommerce-platform",
    },
    {
      id: "proj-002",
      name: "Task Management App",
      description: "Real-time collaborative task management application",
      technologies: ["React", "Socket.io", "Express", "PostgreSQL"],
      startDate: "2022-08",
      endDate: "2022-12",
      link: "https://taskmanager-app.com",
      repository: "https://github.com/ahmed/task-manager",
    },
  ],
  certifications: [
    {
      id: "cert-001",
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "2023-03",
      expiryDate: "2026-03",
      credentialId: "AWS-DEV-2023-001",
      link: "https://aws.amazon.com/certification/verify",
    },
    {
      id: "cert-002",
      name: "React Professional Developer",
      issuer: "Meta",
      date: "2022-11",
      credentialId: "META-REACT-2022-001",
      link: "https://developers.facebook.com/certificate",
    },
  ],
  languages: [
    { name: "Arabic", level: "Native" },
    { name: "English", level: "Fluent" },
    { name: "French", level: "Intermediate" },
  ],
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-20T14:45:00Z",
};

export const mockJobDescription: JobDescription = {
  id: "jd-001",
  title: "Senior React Developer",
  company: "Saudi Digital Company",
  location: "Riyadh, Saudi Arabia",
  description:
    "We are looking for an experienced React Developer to join our growing team. The ideal candidate will have strong expertise in modern JavaScript frameworks and a passion for creating exceptional user experiences.",
  requirements: [
    "5+ years of experience in React development",
    "Strong knowledge of TypeScript",
    "Experience with state management (Redux, Zustand)",
    "Familiarity with testing frameworks (Jest, React Testing Library)",
    "Knowledge of RESTful APIs and GraphQL",
    "Experience with version control (Git)",
    "Bachelor's degree in Computer Science or related field",
  ],
  responsibilities: [
    "Develop and maintain React applications",
    "Collaborate with UX/UI designers to implement pixel-perfect designs",
    "Write clean, maintainable, and well-documented code",
    "Participate in code reviews and mentor junior developers",
    "Optimize applications for maximum speed and scalability",
    "Stay up-to-date with the latest React ecosystem trends",
  ],
  skills: [
    "React",
    "TypeScript",
    "JavaScript",
    "Redux",
    "HTML5",
    "CSS3",
    "Git",
    "Jest",
    "RESTful APIs",
    "Agile methodologies",
  ],
  experience: "5+ years",
  salary: "SAR 15,000 - 25,000",
  benefits: [
    "Health insurance",
    "Annual bonus",
    "Professional development budget",
    "Flexible working hours",
    "Remote work options",
  ],
};

export const mockATSScore: ATSScore = {
  overall: 78,
  categories: {
    formatting: {
      score: 85,
      feedback: [
        "Clean and professional layout",
        "Good use of white space",
        "Consider using bullet points for achievements",
      ],
    },
    keywords: {
      score: 72,
      matched: ["React", "TypeScript", "JavaScript", "Node.js", "Git"],
      missing: ["Redux", "Jest", "RESTful APIs", "Agile"],
      feedback: [
        "Strong match for technical skills",
        "Add more testing-related keywords",
        'Include methodology keywords like "Agile" or "Scrum"',
      ],
    },
    experience: {
      score: 82,
      feedback: [
        "Experience level matches job requirements",
        "Good progression in roles",
        "Quantify achievements with more specific metrics",
      ],
    },
    education: {
      score: 90,
      feedback: [
        "Strong educational background",
        "Relevant degree for the position",
        "Consider adding relevant certifications",
      ],
    },
    skills: {
      score: 75,
      feedback: [
        "Good technical skill coverage",
        "Add more soft skills",
        "Include proficiency levels for skills",
      ],
    },
  },
  recommendations: [
    "Add missing keywords: Redux, Jest, RESTful APIs",
    "Include more quantified achievements",
    "Add soft skills like communication and teamwork",
    "Consider adding a projects section",
    "Use action verbs in experience descriptions",
  ],
  estimatedPassRate: 75,
};

export const mockMatchAnalysis: MatchAnalysis = {
  overallMatch: 82,
  skillsMatch: {
    matched: ["React", "TypeScript", "JavaScript", "Node.js", "Git"],
    missing: ["Redux", "Jest", "GraphQL"],
    percentage: 70,
  },
  experienceMatch: {
    relevant: true,
    yearsMatch: true,
    percentage: 90,
  },
  educationMatch: {
    relevant: true,
    percentage: 95,
  },
  recommendations: [
    "Add Redux experience to your skills section",
    "Mention any testing experience you have",
    "Highlight any GraphQL projects or experience",
    "Emphasize your leadership and mentoring experience",
  ],
  improvementAreas: [
    {
      area: "Testing Skills",
      priority: "high",
      suggestions: [
        "Add Jest or React Testing Library experience",
        "Mention any unit testing practices you follow",
        "Include test coverage metrics from your projects",
      ],
    },
    {
      area: "State Management",
      priority: "medium",
      suggestions: [
        "Add Redux experience if you have it",
        "Mention state management patterns you use",
        "Highlight complex state management scenarios you've handled",
      ],
    },
    {
      area: "API Integration",
      priority: "low",
      suggestions: [
        "Explicitly mention RESTful API experience",
        "Add any GraphQL experience",
        "Describe API integration challenges you've solved",
      ],
    },
  ],
};
