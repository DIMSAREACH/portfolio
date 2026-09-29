import { BilingualField, BilingualArrayField } from './api-response.model';
import { Category } from './category.model';

/**
 * Project Model
 * Aligned with PRD Section 11.5
 */

export type ProjectStatus = 'draft' | 'published';

export interface Project {
  _id: string;
  title: BilingualField;
  slug: string;
  shortDescription: BilingualField;
  fullDescription: BilingualField;
  problem?: BilingualField;
  solution?: BilingualField;
  features?: BilingualArrayField;
  technologies: string[];
  category: Category | string;
  mainImage: string;
  screenshots: string[];
  githubUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
  startDate?: string | Date;
  completionDate?: string | Date;
  challenges?: BilingualField;
  lessonsLearned?: BilingualField;
  featured: boolean;
  status: ProjectStatus;
  order: number;
  viewCount: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ProjectFilterQuery {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  status?: ProjectStatus;
  search?: string;
}
