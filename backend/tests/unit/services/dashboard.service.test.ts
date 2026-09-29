import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import Project from '../../../src/models/Project';
import BlogPost from '../../../src/models/BlogPost';
import Message from '../../../src/models/Message';
import Skill from '../../../src/models/Skill';
import Experience from '../../../src/models/Experience';
import Settings from '../../../src/models/Settings';
import dashboardService from '../../../src/services/dashboard.service';

describe('DashboardService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getStats', () => {
    it('should aggregate counts from all collections and return structured stats', async () => {
      jest.spyOn(Project, 'countDocuments').mockImplementation(((filter?: any) => {
        if (!filter || Object.keys(filter).length === 0) return Promise.resolve(10);
        if (filter.status === 'published') return Promise.resolve(8);
        if (filter.status === 'draft') return Promise.resolve(2);
        return Promise.resolve(0);
      }) as any);

      jest.spyOn(BlogPost, 'countDocuments').mockImplementation(((filter?: any) => {
        if (!filter || Object.keys(filter).length === 0) return Promise.resolve(15);
        if (filter.status === 'published') return Promise.resolve(12);
        if (filter.status === 'draft') return Promise.resolve(3);
        return Promise.resolve(0);
      }) as any);

      jest.spyOn(Message, 'countDocuments').mockImplementation(((filter?: any) => {
        if (!filter || Object.keys(filter).length === 0) return Promise.resolve(25);
        if (filter.isRead === false) return Promise.resolve(5);
        return Promise.resolve(0);
      }) as any);

      jest.spyOn(Skill, 'countDocuments').mockResolvedValue(20 as any);
      jest.spyOn(Experience, 'countDocuments').mockResolvedValue(4 as any);

      const mockSettingsQuery = {
        select: (jest.fn() as any).mockResolvedValue({ cvDownloadCount: 42 }),
      };
      jest.spyOn(Settings, 'findOne').mockReturnValue(mockSettingsQuery as any);

      const mockMessageQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockImplementation(() =>
          Promise.resolve([
            {
              _id: '1',
              name: 'Tester',
              email: 'test@example.com',
              subject: 'Hi',
              isRead: false,
            },
          ]),
        ),
      };
      jest.spyOn(Message, 'find').mockReturnValue(mockMessageQuery as any);

      const stats = await dashboardService.getStats();

      expect(stats.totalProjects).toBe(10);
      expect(stats.publishedProjects).toBe(8);
      expect(stats.draftProjects).toBe(2);
      expect(stats.totalBlogPosts).toBe(15);
      expect(stats.publishedBlogPosts).toBe(12);
      expect(stats.draftBlogPosts).toBe(3);
      expect(stats.totalMessages).toBe(25);
      expect(stats.unreadMessages).toBe(5);
      expect(stats.totalSkills).toBe(20);
      expect(stats.totalExperiences).toBe(4);
      expect(stats.cvDownloads).toBe(42);
      expect(stats.recentMessages).toHaveLength(1);
    });

    it('should default cvDownloads to 0 when settings document is not found', async () => {
      jest.spyOn(Project, 'countDocuments').mockResolvedValue(0 as any);
      jest.spyOn(BlogPost, 'countDocuments').mockResolvedValue(0 as any);
      jest.spyOn(Message, 'countDocuments').mockResolvedValue(0 as any);
      jest.spyOn(Skill, 'countDocuments').mockResolvedValue(0 as any);
      jest.spyOn(Experience, 'countDocuments').mockResolvedValue(0 as any);

      const mockSettingsQuery = {
        select: (jest.fn() as any).mockResolvedValue(null),
      };
      jest.spyOn(Settings, 'findOne').mockReturnValue(mockSettingsQuery as any);

      const mockMessageQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockImplementation(() => Promise.resolve([])),
      };
      jest.spyOn(Message, 'find').mockReturnValue(mockMessageQuery as any);

      const stats = await dashboardService.getStats();

      expect(stats.cvDownloads).toBe(0);
    });
  });
});
