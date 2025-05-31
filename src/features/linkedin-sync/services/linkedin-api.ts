import {
  LinkedInProfile,
  LinkedInPositions,
  LinkedInEducation,
  LinkedInSkills,
  LinkedInCVData,
} from "../types";

export class LinkedInAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errorCode?: string
  ) {
    super(message);
    this.name = "LinkedInAPIError";
  }
}

export class LinkedInAPIService {
  private baseURL = "https://api.linkedin.com/v2";

  constructor(private accessToken: string) {}

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
          "X-RestLi-Protocol-Version": "2.0.0",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new LinkedInAPIError(
          errorData.message || `LinkedIn API error: ${response.status}`,
          response.status,
          errorData.code
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof LinkedInAPIError) {
        throw error;
      }
      throw new LinkedInAPIError(
        `Network error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getProfile(): Promise<LinkedInProfile> {
    // Use the modern /me endpoint instead of deprecated /people/~
    return this.makeRequest<LinkedInProfile>("/userinfo");
  }

  async getPositions(): Promise<LinkedInPositions> {
    // Note: This endpoint requires additional permissions that may not be available with basic OAuth
    // For now, we'll return empty data to avoid errors
    return { elements: [] };
  }

  async getEducation(): Promise<LinkedInEducation> {
    // Note: This endpoint requires additional permissions that may not be available with basic OAuth
    // For now, we'll return empty data to avoid errors
    return { elements: [] };
  }

  async getSkills(): Promise<LinkedInSkills> {
    // Note: This endpoint requires additional permissions that may not be available with basic OAuth
    // For now, we'll return empty data to avoid errors
    return { elements: [] };
  }

  async getEmailAddress(): Promise<{
    elements: Array<{ "handle~": { emailAddress: string } }>;
  }> {
    try {
      // Modern email endpoint
      return this.makeRequest(
        "/emailAddress?q=members&projection=(elements*(handle~))"
      );
    } catch (error) {
      console.warn("Could not fetch email address:", error);
      return { elements: [] };
    }
  }

  async getCompleteProfile(): Promise<LinkedInCVData> {
    try {
      // Only fetch basic profile data that's available with openid + profile scope
      const profile = await this.getProfile();

      // For work experience, education, and skills, we'll return empty arrays
      // as these require special LinkedIn partner permissions
      const positions = { elements: [] };
      const education = { elements: [] };
      const skills = { elements: [] };

      return this.transformToCV(profile, positions, education, skills);
    } catch (error) {
      if (error instanceof LinkedInAPIError) {
        throw error;
      }
      throw new LinkedInAPIError(
        `Failed to fetch complete profile: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private transformToCV(
    profile: LinkedInProfile,
    positions: LinkedInPositions,
    education: LinkedInEducation,
    skills: LinkedInSkills
  ): LinkedInCVData {
    return {
      personalInfo: {
        fullName: this.getLocalizedName(profile),
        email: profile.emailAddress, // This might not be available depending on scopes
        phone: profile.phoneNumbers?.[0]?.number,
        location: this.formatLocation(profile.location),
        headline: this.getLocalizedText(profile.headline),
        profilePicture: profile.profilePicture?.displayImageReference?.url,
      },
      workExperience: positions.elements.map((position) => ({
        jobTitle: position.title,
        company: position.company.name,
        location: this.formatLocation(position.location),
        startDate: this.parseDate(position.timePeriod.startDate),
        endDate: position.timePeriod.endDate
          ? this.parseDate(position.timePeriod.endDate)
          : undefined,
        isCurrentRole: !position.timePeriod.endDate,
        description: position.description,
      })),
      education: education.elements.map((edu) => ({
        degree: edu.degree,
        institution: edu.school.name,
        fieldOfStudy: edu.fieldOfStudy,
        graduationDate: this.parseDate(
          edu.timePeriod.endDate || edu.timePeriod.startDate
        ),
        activities: edu.activities,
      })),
      skills: skills.elements.map((skill) => ({
        name: skill.name,
        endorsements: skill.endorsements,
      })),
    };
  }

  private getLocalizedName(profile: LinkedInProfile): string {
    // Handle both old and new API response formats
    if (profile.firstName?.localized && profile.lastName?.localized) {
      const firstName = Object.values(profile.firstName.localized)[0] || "";
      const lastName = Object.values(profile.lastName.localized)[0] || "";
      return `${firstName} ${lastName}`.trim();
    }

    // Fallback for simpler API responses (basic profile data)
    const profileData = profile as LinkedInProfile & {
      localizedFirstName?: string;
      localizedLastName?: string;
    };
    const firstName = profileData.localizedFirstName || "";
    const lastName = profileData.localizedLastName || "";
    return `${firstName} ${lastName}`.trim();
  }

  private getLocalizedText(localizedField?: {
    localized: Record<string, string>;
  }): string | undefined {
    if (!localizedField) return undefined;
    return Object.values(localizedField.localized)[0];
  }

  private formatLocation(location?: {
    country: string;
    region: string;
  }): string | undefined {
    if (!location) return undefined;
    return [location.region, location.country].filter(Boolean).join(", ");
  }

  private parseDate(dateObj: { month: number; year: number }): Date {
    // LinkedIn months are 1-indexed, JavaScript months are 0-indexed
    return new Date(dateObj.year, dateObj.month - 1, 1);
  }
}

// Factory function for creating API service instance
export const createLinkedInAPIService = (accessToken: string) =>
  new LinkedInAPIService(accessToken);
