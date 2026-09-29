import { BilingualField } from './api-response.model';
import { Category } from './category.model';
import { User } from './user.model';

/**
 * Blog Post Model
 * Aligned with PRD Section 11.10
 */

export type BlogPostStatus = 'draft' | 'published';

export interface BlogPost {
  _id: string;
  title: BilingualField;
  slug: string;
  excerpt: BilingualField;
  content: BilingualField;
  coverImage?: string;
  category: Category | string;
  tags: string[];
  status: BlogPostStatus;
  featured: boolean;
  publishedAt?: string | Date;
  readingTime: number;
  viewCount: number;
  author: User | string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface BlogPostFilterQuery {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  featured?: boolean;
  status?: BlogPostStatus;
  search?: string;
}
