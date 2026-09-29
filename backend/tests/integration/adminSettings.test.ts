import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import app from '../../src/app';
import Settings from '../../src/models/Settings';
import { generateAccessToken } from '../../src/utils/jwt';

describe('Admin Settings API Integration Tests (/api/v1/admin/settings)', () => {
  const dummyAdminToken = generateAccessToken('admin-user-id', 'admin');
  const dummyUserToken = generateAccessToken('normal-user-id', 'user');

  const mockSettings: any = {
    _id: '6abc2f77ed5966aa1b87e233',
    siteTitle: { en: 'Developer Portfolio', kh: 'គេហទំព័រផ្ទាល់ខ្លួន' },
    siteDescription: { en: 'Full stack developer portfolio', kh: 'គេហទំព័របង្ហាញស្នាដៃ' },
    enableCvDownload: true,
    cvDownloadCount: 10,
    enableContactForm: true,
    emailNotifications: true,
    notificationEmail: 'admin@example.com',
    maintenanceMode: false,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSettings.save.mockResolvedValue(mockSettings);
    jest.spyOn(Settings.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/v1/admin/settings', () => {
    it('should return 200 and settings for admin', async () => {
      jest.spyOn(Settings, 'findOne').mockResolvedValue(mockSettings as any);

      const res = await request(app)
        .get('/api/v1/admin/settings')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.siteTitle.en).toBe('Developer Portfolio');
      expect(res.body.data.enableCvDownload).toBe(true);
    });

    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/v1/admin/settings');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject non-admin request with 403', async () => {
      const res = await request(app)
        .get('/api/v1/admin/settings')
        .set('Authorization', `Bearer ${dummyUserToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/admin/settings', () => {
    it('should update settings for admin and return 200', async () => {
      const targetSettings = {
        ...mockSettings,
        save: jest.fn().mockImplementation(function (this: any) {
          return Promise.resolve(this);
        }),
      };
      jest.spyOn(Settings, 'findOne').mockResolvedValue(targetSettings as any);

      const res = await request(app)
        .put('/api/v1/admin/settings')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          siteTitle: { en: 'Updated Portfolio', kh: 'គេហទំព័រកែប្រែ' },
          maintenanceMode: true,
          notificationEmail: 'hello@dimasreach.dev',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(targetSettings.siteTitle.en).toBe('Updated Portfolio');
      expect(targetSettings.maintenanceMode).toBe(true);
      expect(targetSettings.notificationEmail).toBe('hello@dimasreach.dev');
    });

    it('should reject invalid notificationEmail with 400', async () => {
      const res = await request(app)
        .put('/api/v1/admin/settings')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          notificationEmail: 'invalid-email-address',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app)
        .put('/api/v1/admin/settings')
        .send({ maintenanceMode: true });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
