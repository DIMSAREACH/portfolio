import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import app from '../../src/app';
import Profile from '../../src/models/Profile';
import cloudinaryService from '../../src/services/cloudinary.service';
import { generateAccessToken } from '../../src/utils/jwt';

describe('Admin Profile API Integration Tests (/api/v1/admin/profile)', () => {
  const dummyAdminToken = generateAccessToken('admin-user-id', 'admin');
  const dummyUserToken = generateAccessToken('normal-user-id', 'user');

  const mockProfile: any = {
    _id: '6abc2f77ed5966aa1b87e233',
    fullName: { en: 'Dara Sok', kh: 'សុខ តារា' },
    title: { en: 'Senior Full Stack Developer', kh: 'អ្នកអភិវឌ្ឍន៍ជាន់ខ្ពស់' },
    introduction: { en: 'Building scalable web apps', kh: 'បង្កើតគេហទំព័រទំនើប' },
    about: { en: 'Experienced engineer', kh: 'វិស្វករមានបទពិសោធន៍' },
    professionalSummary: { en: 'Summary', kh: 'សេចក្ដីសង្ខេប' },
    careerInterests: { en: 'Interests', kh: 'ចំណាប់អារម្មណ៍' },
    background: { en: 'Background', kh: 'ប្រវត្តិរូប' },
    strengths: { en: ['Node.js'], kh: ['Node.js'] },
    goals: { en: 'Goals', kh: 'គោលដៅ' },
    profileImage: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/profile/profile.webp',
    aboutImage: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/profile/about.webp',
    email: 'dara@example.com',
    phone: '+85512345678',
    location: { en: 'Phnom Penh', kh: 'ភ្នំពេញ' },
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockProfile.save.mockResolvedValue(mockProfile);
    jest.spyOn(Profile.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/v1/admin/profile', () => {
    it('should return 200 and profile for admin', async () => {
      jest.spyOn(Profile, 'findOne').mockResolvedValue(mockProfile as any);

      const res = await request(app)
        .get('/api/v1/admin/profile')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.fullName.en).toBe('Dara Sok');
    });

    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/v1/admin/profile');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject non-admin request with 403', async () => {
      const res = await request(app)
        .get('/api/v1/admin/profile')
        .set('Authorization', `Bearer ${dummyUserToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/admin/profile', () => {
    it('should upsert profile with JSON payload for admin', async () => {
      jest.spyOn(Profile, 'findOne').mockResolvedValue(mockProfile as any);

      const res = await request(app)
        .put('/api/v1/admin/profile')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          fullName: { en: 'Dara Sok Updated', kh: 'សុខ តារា' },
          email: 'updated@example.com',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.fullName.en).toBe('Dara Sok Updated');
      expect(res.body.data.email).toBe('updated@example.com');
    });

    it('should accept multipart/form-data with profileImage and aboutImage uploads', async () => {
      jest.spyOn(Profile, 'findOne').mockResolvedValue(mockProfile as any);
      jest.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue({
        url: 'http://res.cloudinary.com/demo/image/upload/v9999/portfolio/profile/new_avatar.webp',
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/v9999/portfolio/profile/new_avatar.webp',
        publicId: 'portfolio/profile/new_avatar',
        width: 500,
        height: 500,
        format: 'webp',
        bytes: 15000,
        resourceType: 'image',
      });
      jest.spyOn(cloudinaryService, 'deleteFile').mockResolvedValue({ result: 'ok' });

      const fakeImageBuffer = Buffer.from('fake-image-content');

      const res = await request(app)
        .put('/api/v1/admin/profile')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .field('fullName', JSON.stringify({ en: 'Dara Sok', kh: 'សុខ តារា' }))
        .field('title', JSON.stringify({ en: 'Lead Architect', kh: 'ស្ថាបត្យករដឹកនាំ' }))
        .attach('profileImage', fakeImageBuffer, 'avatar.png');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(cloudinaryService.uploadImage).toHaveBeenCalled();
    });

    it('should reject invalid email with 400', async () => {
      const res = await request(app)
        .put('/api/v1/admin/profile')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          email: 'not-an-email',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });
});
