import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import app from '../../src/app';
import SocialLink from '../../src/models/SocialLink';
import { generateAccessToken } from '../../src/utils/jwt';

describe('Admin Social Links API Integration Tests (/api/v1/admin/social-links)', () => {
  const dummyAdminToken = generateAccessToken('admin-user-id', 'admin');
  const dummyUserToken = generateAccessToken('normal-user-id', 'user');
  const validLinkId = new mongoose.Types.ObjectId().toString();

  const mockSocialLink: any = {
    _id: validLinkId,
    platform: 'github',
    label: 'GitHub',
    url: 'https://github.com/dimasreach',
    icon: 'tabler:brand-github',
    order: 1,
    isVisible: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSocialLink.save.mockResolvedValue(mockSocialLink);
    jest.spyOn(SocialLink.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/v1/admin/social-links', () => {
    it('should return 200 and list of social links for admin', async () => {
      const mockQueryChain = {
        sort: jest.fn().mockImplementation(() => Promise.resolve([mockSocialLink])),
      };
      jest.spyOn(SocialLink, 'find').mockReturnValue(mockQueryChain as any);

      const res = await request(app)
        .get('/api/v1/admin/social-links')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].platform).toBe('github');
    });

    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/v1/admin/social-links');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject non-admin request with 403', async () => {
      const res = await request(app)
        .get('/api/v1/admin/social-links')
        .set('Authorization', `Bearer ${dummyUserToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/admin/social-links/:id', () => {
    it('should return 200 and social link for valid ID', async () => {
      jest.spyOn(SocialLink, 'findById').mockResolvedValue(mockSocialLink as any);

      const res = await request(app)
        .get(`/api/v1/admin/social-links/${validLinkId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.label).toBe('GitHub');
    });

    it('should reject invalid mongo ID with 400', async () => {
      const res = await request(app)
        .get('/api/v1/admin/social-links/not-a-mongo-id')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 when social link not found', async () => {
      jest.spyOn(SocialLink, 'findById').mockResolvedValue(null as any);

      const res = await request(app)
        .get(`/api/v1/admin/social-links/${validLinkId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/admin/social-links', () => {
    it('should create new social link and return 201', async () => {
      const mockHighest = {
        sort: jest.fn().mockReturnThis(),
        select: (jest.fn() as any).mockResolvedValue({ order: 2 }),
      };
      jest.spyOn(SocialLink, 'findOne').mockReturnValue(mockHighest as any);

      const res = await request(app)
        .post('/api/v1/admin/social-links')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          platform: 'linkedin',
          label: 'LinkedIn',
          url: 'https://linkedin.com/in/dimasreach',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.platform).toBe('linkedin');
    });

    it('should reject invalid platform with 400', async () => {
      const res = await request(app)
        .post('/api/v1/admin/social-links')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          platform: 'invalid-platform',
          label: 'My Link',
          url: 'https://example.com',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/v1/admin/social-links/:id', () => {
    it('should update social link and return 200', async () => {
      const targetLink = {
        ...mockSocialLink,
        save: jest.fn().mockImplementation(function (this: any) {
          return Promise.resolve(this);
        }),
      };
      jest.spyOn(SocialLink, 'findById').mockResolvedValue(targetLink as any);

      const res = await request(app)
        .patch(`/api/v1/admin/social-links/${validLinkId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          label: 'Updated GitHub',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(targetLink.label).toBe('Updated GitHub');
    });

    it('should return 404 when updating non-existent link', async () => {
      jest.spyOn(SocialLink, 'findById').mockResolvedValue(null as any);

      const res = await request(app)
        .patch(`/api/v1/admin/social-links/${validLinkId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          label: 'Updated Label',
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/admin/social-links/:id', () => {
    it('should delete social link and return 200', async () => {
      jest.spyOn(SocialLink, 'findById').mockResolvedValue(mockSocialLink as any);
      jest.spyOn(SocialLink, 'findByIdAndDelete').mockResolvedValue(mockSocialLink as any);

      const res = await request(app)
        .delete(`/api/v1/admin/social-links/${validLinkId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(SocialLink.findByIdAndDelete).toHaveBeenCalledWith(validLinkId);
    });

    it('should return 404 when deleting non-existent link', async () => {
      jest.spyOn(SocialLink, 'findById').mockResolvedValue(null as any);

      const res = await request(app)
        .delete(`/api/v1/admin/social-links/${validLinkId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/v1/admin/social-links/reorder', () => {
    it('should reorder social links and return updated list', async () => {
      jest.spyOn(SocialLink, 'bulkWrite').mockResolvedValue({} as any);
      const mockQueryChain = {
        sort: jest.fn().mockImplementation(() => Promise.resolve([mockSocialLink])),
      };
      jest.spyOn(SocialLink, 'find').mockReturnValue(mockQueryChain as any);

      const res = await request(app)
        .patch('/api/v1/admin/social-links/reorder')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          items: [{ id: validLinkId, order: 0 }],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(SocialLink.bulkWrite).toHaveBeenCalled();
    });

    it('should reject invalid reorder payload with 400', async () => {
      const res = await request(app)
        .patch('/api/v1/admin/social-links/reorder')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          items: [{ id: 'not-an-id', order: -1 }],
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
