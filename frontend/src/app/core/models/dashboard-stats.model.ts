import { Message } from './message.model';

/**
 * Dashboard Statistics Model
 * Aligned with PRD Section 9.2
 */
export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  totalBlogPosts: number;
  publishedBlogPosts: number;
  draftBlogPosts: number;
  unreadMessages: number;
  totalMessages: number;
  totalSkills: number;
  totalExperiences: number;
  cvDownloads: number;
  recentMessages?: Message[];
}
