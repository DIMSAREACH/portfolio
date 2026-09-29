import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import app from '../../src/app';
import Project from '../../src/models/Project';
import BlogPost from '../../src/models/BlogPost';
import Message from '../../src/models/Message';
import Skill from '../../src/models/Skill';
import Experience from '../../src/models/Experience';
import Settings from '../../src/models/Settings';
import { generateAccessToken } from '../../src/utils/jwt';

describe('Admin Dashboard Stats API Integration Tests (/api/v1/admin/dashboard/stats)', () => {
  const dummyAdminToken = generateAccessToken('admin-user-id', 'admin');
  const dummyUserToken = generateAccessToken('normal-user-id', 'user');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/v1/admin/dashboard/stats', () => {
    it('should return 200 and stats object for admin', async () => {
      jest.spyOn(Project, 'countDocuments').mockResolvedValue(12 as any);
      jest.spyOn(BlogPost, 'countDocuments').mockResolvedValue(8 as any);
      jest.spyOn(Message, 'countDocuments').mockResolvedValue(4 as any);
      jest.spyOn(Skill, 'countDocuments').mockResolvedValue(15 as any);
      jest.spyOn(Experience, 'countDocuments').mockResolvedValue(3 as any);

      const mockSettingsQuery = {
        select: (jest.fn() as any).mockResolvedValue({ cvDownloadCount: 99 }),
      };
      jest.spyOn(Settings, 'findOne').mockReturnValue(mockSettingsQuery as any);

      const mockMessageQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockImplementation(() => Promise.resolve([])),
      };
      jest.spyOn(Message, 'find').mockReturnValue(mockMessageQuery as any);

      const res = await request(app)
        .get('/api/v1/admin/dashboard/stats')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.totalProjects).toBe(12);
      expect(res.body.data.cvDownloads).toBe(99);
    });

    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/v1/admin/dashboard/stats');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject non-admin request with 403', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard/stats')
        .set('Authorization', `Bearer ${dummyUserToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/admin/stats (alias)', () => {
    it('should return 200 and stats object through /stats alias', async () => {
      jest.spyOn(Project, 'countDocuments').mockResolvedValue(5 as any);
      jest.spyOn(BlogPost, 'countDocuments').mockResolvedValue(5 as any);
      jest.spyOn(Message, 'countDocuments').mockResolvedValue(5 as any);
      jest.spyOn(Skill, 'countDocuments').mockResolvedValue(5 as any);
      jest.spyOn(Experience, 'countDocuments').mockResolvedValue(5 as any);

      const mockSettingsQuery = {
        select: (jest.fn() as any).mockResolvedValue({ cvDownloadCount: 10 }),
      };
      jest.spyOn(Settings, 'findOne').mockReturnValue(mockSettingsQuery as any);

      const mockMessageQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockImplementation(() => Promise.resolve([])),
      };
      jest.spyOn(Message, 'find').mockReturnValue(mockMessageQuery as any);

      const res = await request(app)
        .get('/api/v1/admin/stats')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalProjects).toBe(5);
    });
  });
});
