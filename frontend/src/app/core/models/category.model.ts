import { BilingualField } from './api-response.model';

/**
 * Category Model
 * Aligned with PRD Section 11.4
 */

export type CategoryType = 'project' | 'blog' | 'both';

export interface Category {
  _id: string;
  name: BilingualField;
  slug: string;
  description?: BilingualField;
  type: CategoryType;
  order: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
