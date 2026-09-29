import { BilingualField, BilingualArrayField } from './api-response.model';

/**
 * Work and Volunteer Experience Model
 * Aligned with PRD Section 11.7
 */

export type ExperienceType = 'work' | 'volunteer' | 'internship' | 'freelance';

export interface Experience {
  _id: string;
  title: BilingualField;
  organization: BilingualField;
  location?: BilingualField;
  type: ExperienceType;
  startDate: string | Date;
  endDate?: string | Date;
  isCurrent: boolean;
  description?: BilingualField;
  responsibilities?: BilingualArrayField;
  technologies: string[];
  order: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
