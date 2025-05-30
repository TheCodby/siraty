export interface JobDescription {
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
}
