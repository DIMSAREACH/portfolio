import Project from '../models/Project';
import BlogPost from '../models/BlogPost';
import Message, { IMessage } from '../models/Message';
import Skill from '../models/Skill';
import Experience from '../models/Experience';
import Settings from '../models/Settings';

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
  recentMessages?: IMessage[];
}

export class DashboardService {
  /**
   * Aggregate real counts across all primary collections
   */
  async getStats(): Promise<DashboardStats> {
    const [
      totalProjects,
      publishedProjects,
      draftProjects,
      totalBlogPosts,
      publishedBlogPosts,
      draftBlogPosts,
      unreadMessages,
      totalMessages,
      totalSkills,
      totalExperiences,
      settings,
      recentMessages,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: 'published' }),
      Project.countDocuments({ status: 'draft' }),
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ status: 'published' }),
      BlogPost.countDocuments({ status: 'draft' }),
      Message.countDocuments({ isRead: false }),
      Message.countDocuments(),
      Skill.countDocuments(),
      Experience.countDocuments(),
      Settings.findOne().select('cvDownloadCount'),
      Message.find({ isRead: false }).sort({ createdAt: -1 }).limit(5),
    ]);

    return {
      totalProjects,
      publishedProjects,
      draftProjects,
      totalBlogPosts,
      publishedBlogPosts,
      draftBlogPosts,
      unreadMessages,
      totalMessages,
      totalSkills,
      totalExperiences,
      cvDownloads: settings?.cvDownloadCount ?? 0,
      recentMessages,
    };
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
