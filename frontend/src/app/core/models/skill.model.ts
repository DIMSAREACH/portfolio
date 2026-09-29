import { BilingualField } from './api-response.model';

/**
 * Skill Model
 * Aligned with PRD Section 11.6
 */

export interface Skill {
  _id: string;
  name: string;
  category: BilingualField;
  icon?: string;
  order: number;
  isVisible: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
