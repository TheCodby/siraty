// LinkedIn API response types
export interface LinkedInProfile {
  id: string;
  localizedFirstName?: string; // Basic /me endpoint
  localizedLastName?: string; // Basic /me endpoint
  firstName?: {
    // Full profile endpoint (requires more permissions)
    localized: Record<string, string>;
  };
  lastName?: {
    // Full profile endpoint (requires more permissions)
    localized: Record<string, string>;
  };
  headline?: {
    localized: Record<string, string>;
  };
  profilePicture?: {
    displayImageReference?: {
      url: string;
    };
  };
  location?: {
    country: string;
    region: string;
  };
  emailAddress?: string; // May not be available with basic scopes
  phoneNumbers?: Array<{
    number: string;
    type: string;
  }>;
}

export interface LinkedInPositions {
  elements: Array<{
    company: {
      name: string;
      logo?: string;
    };
    title: string;
    description?: string;
    location?: {
      country: string;
      region: string;
    };
    timePeriod: {
      startDate: {
        month: number;
        year: number;
      };
      endDate?: {
        month: number;
        year: number;
      };
    };
  }>;
}

export interface LinkedInEducation {
  elements: Array<{
    school: {
      name: string;
      logo?: string;
    };
    degree?: string;
    fieldOfStudy?: string;
    activities?: string;
    timePeriod: {
      startDate: {
        month: number;
        year: number;
      };
      endDate?: {
        month: number;
        year: number;
      };
    };
  }>;
}

export interface LinkedInSkills {
  elements: Array<{
    name: string;
    endorsements?: number;
  }>;
}

// Transformed data types for our CV system
export interface LinkedInCVData {
  personalInfo: {
    fullName: string;
    email?: string;
    phone?: string;
    location?: string;
    headline?: string;
    profilePicture?: string;
  };
  workExperience: Array<{
    jobTitle: string;
    company: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    isCurrentRole: boolean;
    description?: string;
  }>;
  education: Array<{
    degree?: string;
    institution: string;
    fieldOfStudy?: string;
    graduationDate: Date;
    activities?: string;
  }>;
  skills: Array<{
    name: string;
    endorsements?: number;
  }>;
}

export interface LinkedInSyncState {
  isLoading: boolean;
  error?: string;
  profileData?: LinkedInCVData;
  lastSyncAt?: Date;
}

export interface LinkedInSyncOptions {
  includeProfile: boolean;
  includeExperience: boolean;
  includeEducation: boolean;
  includeSkills: boolean;
  overwriteExisting: boolean;
}
