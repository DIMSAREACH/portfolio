import { BilingualField, BilingualArrayField } from './api-response.model';

/**
 * Education History Model
 * Aligned with PRD Section 11.8
 */

export interface Education {
  _id: string;
  institution: BilingualField;
  degree: BilingualField;
  field: BilingualField;
  startYear: number;
  endYear?: number;
  description?: BilingualField;
  activities?: BilingualArrayField;
  gpa?: string;
  order: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
