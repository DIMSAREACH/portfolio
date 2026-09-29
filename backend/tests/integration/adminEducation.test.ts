import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import app from '../../src/app';
import Education from '../../src/models/Education';
import { generateAccessToken } from '../../src/utils/jwt';

describe('Admin Education API Integration Tests (/api/v1/admin/education)', () => {
  const dummyAdminToken = generateAccessToken('admin-id-12345', 'admin');
  const validEduId = new mongoose.Types.ObjectId().toString();

  const mockEducation: any = {
    _id: validEduId,
    institution: { en: 'RUPP', kh: 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ' },
    degree: { en: 'Bachelor', kh: 'បរិញ្ញាបត្រ' },
    field: { en: 'Computer Science', kh: 'វិទ្យាសាស្ត្រកុំព្យូទ័រ' },
    startYear: 2020,
    endYear: 2024,
    order: 1,
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockEducation.save.mockResolvedValue(mockEducation);
    jest.spyOn(Education.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/v1/admin/education', () => {
    it('should return 200 and education entries array for admin', async () => {
      const sortMock = {
        sort: jest.fn().mockImplementation(() => Promise.resolve([mockEducation])),
      };
      jest.spyOn(Education, 'find').mockReturnValue(sortMock as any);

      const res = await request(app)
        .get('/api/v1/admin/education')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].institution.en).toBe('RUPP');
    });

    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/v1/admin/education');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/admin/education/:id', () => {
    it('should return 200 and education entry for valid ID', async () => {
      jest.spyOn(Education, 'findById').mockResolvedValue(mockEducation as any);

      const res = await request(app)
        .get(`/api/v1/admin/education/${validEduId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(validEduId);
    });

    it('should return 400 for invalid mongo ID format', async () => {
      const res = await request(app)
        .get('/api/v1/admin/education/invalid-mongo-id')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });

    it('should return 404 when education entry is not found', async () => {
      jest.spyOn(Education, 'findById').mockResolvedValue(null);

      const res = await request(app)
        .get(`/api/v1/admin/education/${validEduId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/admin/education', () => {
    it('should return 201 on successful education creation', async () => {
      const res = await request(app)
        .post('/api/v1/admin/education')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          institution: { en: 'Institute of Technology of Cambodia', kh: 'វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា' },
          degree: { en: 'Bachelor of Engineering' },
          field: { en: 'Information & Communication Engineering' },
          startYear: 2021,
          endYear: 2025,
          order: 1,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.startYear).toBe(2021);
      expect(res.body.message).toBe('Education entry created successfully');
    });

    it('should return 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/admin/education')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          institution: {},
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });
  });

  describe('PATCH /api/v1/admin/education/:id', () => {
    it('should return 200 on successful education update', async () => {
      const instance: any = {
        ...mockEducation,
        degree: { en: 'Master of Science', kh: '...' },
        save: jest.fn().mockImplementation(() => Promise.resolve(instance)),
      };
      jest.spyOn(Education, 'findById').mockResolvedValue(instance as any);

      const res = await request(app)
        .patch(`/api/v1/admin/education/${validEduId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          degree: { en: 'Master of Science' },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Education entry updated successfully');
    });

    it('should return 404 when education entry to update is not found', async () => {
      jest.spyOn(Education, 'findById').mockResolvedValue(null);

      const res = await request(app)
        .patch(`/api/v1/admin/education/${validEduId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          degree: { en: 'Master of Science' },
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/admin/education/:id', () => {
    it('should return 200 when education entry is deleted successfully', async () => {
      jest.spyOn(Education, 'findById').mockResolvedValue(mockEducation as any);
      jest.spyOn(Education, 'findByIdAndDelete').mockResolvedValue(mockEducation as any);

      const res = await request(app)
        .delete(`/api/v1/admin/education/${validEduId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Education entry deleted successfully');
    });

    it('should return 404 when education entry to delete is not found', async () => {
      jest.spyOn(Education, 'findById').mockResolvedValue(null);

      const res = await request(app)
        .delete(`/api/v1/admin/education/${validEduId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
