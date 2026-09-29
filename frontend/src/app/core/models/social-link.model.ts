/**
 * Social Link Model
 * Aligned with PRD Section 11.14
 */

export type SocialPlatform =
  | 'github'
  | 'linkedin'
  | 'facebook'
  | 'email'
  | 'twitter'
  | 'youtube'
  | 'other';

export interface SocialLink {
  _id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  icon?: string;
  order: number;
  isVisible: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ReorderItem {
  id: string;
  order: number;
}
