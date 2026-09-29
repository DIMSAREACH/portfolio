import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import app from '../../src/app';
import Experience from '../../src/models/Experience';
import { generateAccessToken } from '../../src/utils/jwt';

describe('Admin Experiences API Integration Tests (/api/v1/admin/experiences)', () => {
  const dummyAdminToken = generateAccessToken('admin-id-12345', 'admin');
  const validExpId = new mongoose.Types.ObjectId().toString();

  const mockExperience: any = {
    _id: validExpId,
    title: { en: 'Full Stack Developer', kh: 'អ្នកអភិវឌ្ឍន៍ Full Stack' },
    organization: { en: 'Tech Innovators', kh: 'តិច អ៊ីណូវេសិន' },
    type: 'work',
    startDate: new Date('2023-01-01'),
    isCurrent: true,
    technologies: ['Angular', 'Node.js'],
    order: 1,
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockExperience.save.mockResolvedValue(mockExperience);
    jest.spyOn(Experience.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/v1/admin/experiences', () => {
    it('should return 200 and experiences array for admin', async () => {
      const sortMock = {
        sort: jest.fn().mockImplementation(() => Promise.resolve([mockExperience])),
      };
      jest.spyOn(Experience, 'find').mockReturnValue(sortMock as any);

      const res = await request(app)
        .get('/api/v1/admin/experiences')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title.en).toBe('Full Stack Developer');
    });

    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/v1/admin/experiences');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/admin/experiences/:id', () => {
    it('should return 200 and experience for valid ID', async () => {
      jest.spyOn(Experience, 'findById').mockResolvedValue(mockExperience as any);

      const res = await request(app)
        .get(`/api/v1/admin/experiences/${validExpId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(validExpId);
    });

    it('should return 400 for invalid mongo ID format', async () => {
      const res = await request(app)
        .get('/api/v1/admin/experiences/not-a-valid-id')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });

    it('should return 404 when experience is not found', async () => {
      jest.spyOn(Experience, 'findById').mockResolvedValue(null);

      const res = await request(app)
        .get(`/api/v1/admin/experiences/${validExpId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/admin/experiences', () => {
    it('should return 201 on successful experience creation', async () => {
      const res = await request(app)
        .post('/api/v1/admin/experiences')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          title: { en: 'Backend Engineer', kh: 'វិស្វករផ្នែកខាងក្រោយ' },
          organization: { en: 'Open Source Community' },
          type: 'volunteer',
          startDate: '2023-05-01',
          isCurrent: true,
          technologies: ['Node.js', 'Express'],
          order: 2,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.type).toBe('volunteer');
      expect(res.body.message).toBe('Experience created successfully');
    });

    it('should return 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/admin/experiences')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          title: {},
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });
  });

  describe('PATCH /api/v1/admin/experiences/:id', () => {
    it('should return 200 on successful experience update', async () => {
      const instance: any = {
        ...mockExperience,
        title: { en: 'Lead Developer', kh: '...' },
        save: jest.fn().mockImplementation(() => Promise.resolve(instance)),
      };
      jest.spyOn(Experience, 'findById').mockResolvedValue(instance as any);

      const res = await request(app)
        .patch(`/api/v1/admin/experiences/${validExpId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          title: { en: 'Lead Developer' },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Experience updated successfully');
    });

    it('should return 404 when experience to update is not found', async () => {
      jest.spyOn(Experience, 'findById').mockResolvedValue(null);

      const res = await request(app)
        .patch(`/api/v1/admin/experiences/${validExpId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          title: { en: 'Lead Developer' },
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/admin/experiences/:id', () => {
    it('should return 200 when experience is deleted successfully', async () => {
      jest.spyOn(Experience, 'findById').mockResolvedValue(mockExperience as any);
      jest.spyOn(Experience, 'findByIdAndDelete').mockResolvedValue(mockExperience as any);

      const res = await request(app)
        .delete(`/api/v1/admin/experiences/${validExpId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Experience deleted successfully');
    });

    it('should return 404 when experience to delete is not found', async () => {
      jest.spyOn(Experience, 'findById').mockResolvedValue(null);

      const res = await request(app)
        .delete(`/api/v1/admin/experiences/${validExpId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
