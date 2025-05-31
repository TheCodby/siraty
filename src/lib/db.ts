import { PrismaClient } from "@prisma/client";
import type {
  ATSScoreData,
  JobMatchData,
  ChatMessageData,
} from "@/types/prisma";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const db =
  globalThis.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// Utility functions for common database operations

// Simple mock database (no external dependencies)
const mockData = {
  cvs: [] as Array<{
    id: string;
    title: string;
    language: string;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
    portfolio?: string;
    summary: string;
    createdAt: Date;
    updatedAt: Date;
  }>,
  jobDescriptions: [] as Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    skills: string[];
    experience: string;
    salary?: string;
    benefits?: string[];
    createdAt: Date;
    updatedAt: Date;
  }>,
  atsScores: [] as Array<
    ATSScoreData & { id: string; createdAt: Date; updatedAt: Date }
  >,
  chatSessions: [] as Array<{
    id: string;
    cvId?: string;
    title: string;
    purpose: string;
    language: string;
    status: string;
    messages: Array<ChatMessageData & { id: string; createdAt: Date }>;
    createdAt: Date;
    updatedAt: Date;
  }>,
  jobMatches: [] as Array<
    JobMatchData & { id: string; createdAt: Date; updatedAt: Date }
  >,
};

// CV Operations
export const cvQueries = {
  async findAll() {
    return mockData.cvs;
  },

  async findById() {
    // TODO: implement when needed
    return null;
  },

  async create(data: {
    title: string;
    language: string;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
    portfolio?: string;
    summary: string;
  }) {
    const cv = {
      id: "cv_" + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    mockData.cvs.push(cv);
    return cv;
  },

  async update() {
    // TODO: implement when needed
    return null;
  },

  async delete() {
    // TODO: implement when needed
    return true;
  },
};

// Job Description Operations
export const jobQueries = {
  async findAll() {
    return mockData.jobDescriptions;
  },

  async findById() {
    // TODO: implement when needed
    return null;
  },

  async create(data: {
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    skills: string[];
    experience: string;
    salary?: string;
    benefits?: string[];
  }) {
    const job = {
      id: "job_" + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    mockData.jobDescriptions.push(job);
    return job;
  },
};

// ATS Scoring Operations
export const atsQueries = {
  async createScore(data: ATSScoreData) {
    const score = {
      id: "ats_" + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    mockData.atsScores.push(score);
    return score;
  },

  async findLatestByCvId() {
    // TODO: implement when needed
    return null;
  },
};

// Chat Operations
export const chatQueries = {
  async findSessions() {
    return mockData.chatSessions;
  },

  async findSessionWithMessages() {
    // TODO: implement when needed
    return null;
  },

  async createSession(data: {
    cvId?: string;
    title: string;
    purpose: string;
    language: string;
  }) {
    const session = {
      id: "chat_" + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "ACTIVE",
      messages: [],
      ...data,
    };
    mockData.chatSessions.push(session);
    return session;
  },

  async createMessage(data: ChatMessageData) {
    const message = {
      id: "msg_" + Date.now(),
      createdAt: new Date(),
      ...data,
    };
    // In a real implementation, we'd find the session and add the message
    return message;
  },
};

// Job Matching Operations
export const jobMatchQueries = {
  async createMatch(data: JobMatchData) {
    const match = {
      id: "match_" + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    mockData.jobMatches.push(match);
    return match;
  },

  async findByJobId() {
    // TODO: implement when needed
    return [];
  },

  async findByCvId() {
    // TODO: implement when needed
    return [];
  },
};
