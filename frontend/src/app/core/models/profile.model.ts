import { BilingualField, BilingualArrayField } from './api-response.model';

/**
 * Developer Profile Model
 * Aligned with PRD Section 11.3
 */

export interface Profile {
  _id?: string;
  fullName: BilingualField;
  title: BilingualField;
  introduction: BilingualField;
  about: BilingualField;
  professionalSummary?: BilingualField;
  careerInterests?: BilingualField;
  background?: BilingualField;
  strengths?: BilingualArrayField;
  goals?: BilingualField;
  profileImage?: string;
  aboutImage?: string;
  email?: string;
  phone?: string;
  location?: BilingualField;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
