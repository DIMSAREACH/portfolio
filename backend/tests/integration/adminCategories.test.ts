import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import app from '../../src/app';
import Category from '../../src/models/Category';
import Project from '../../src/models/Project';
import BlogPost from '../../src/models/BlogPost';
import { generateAccessToken } from '../../src/utils/jwt';

describe('Admin Categories API Integration Tests (/api/v1/admin/categories)', () => {
  const dummyAdminToken = generateAccessToken('admin-id-12345', 'admin');
  const validMongoId = new mongoose.Types.ObjectId().toString();

  const mockCategory: any = {
    _id: validMongoId,
    name: { en: 'Artificial Intelligence', kh: 'បញ្ញាសិប្បនិម្មិត' },
    slug: 'artificial-intelligence',
    type: 'both',
    order: 1,
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCategory.save.mockResolvedValue(mockCategory);
    jest.spyOn(Category.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/v1/admin/categories', () => {
    it('should return 200 and categories array for admin', async () => {
      const sortMock = {
        sort: jest.fn().mockImplementation(() => Promise.resolve([mockCategory])),
      };
      jest.spyOn(Category, 'find').mockReturnValue(sortMock as any);

      const res = await request(app)
        .get('/api/v1/admin/categories')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].slug).toBe('artificial-intelligence');
    });

    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/v1/admin/categories');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/admin/categories/:id', () => {
    it('should return 200 and category for valid ID', async () => {
      jest.spyOn(Category, 'findById').mockResolvedValue(mockCategory as any);

      const res = await request(app)
        .get(`/api/v1/admin/categories/${validMongoId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(validMongoId);
    });

    it('should return 400 for invalid mongo ID format', async () => {
      const res = await request(app)
        .get('/api/v1/admin/categories/invalid-id-format')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });

    it('should return 404 when category does not exist', async () => {
      jest.spyOn(Category, 'findById').mockResolvedValue(null);

      const res = await request(app)
        .get(`/api/v1/admin/categories/${validMongoId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/admin/categories', () => {
    it('should return 201 on successful category creation', async () => {
      jest.spyOn(Category, 'findOne').mockResolvedValue(null);

      const res = await request(app)
        .post('/api/v1/admin/categories')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          name: { en: 'Cloud Architecture', kh: 'ស្ថាបត្យកម្មក្លោដ' },
          type: 'project',
          order: 2,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe('cloud-architecture');
      expect(res.body.message).toBe('Category created successfully');
    });

    it('should return 400 when name.en or type is missing or invalid', async () => {
      const res = await request(app)
        .post('/api/v1/admin/categories')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          name: {},
          type: 'invalid-type',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });
  });

  describe('PATCH /api/v1/admin/categories/:id', () => {
    it('should return 200 on successful category update', async () => {
      const instance: any = {
        ...mockCategory,
        name: { en: 'AI & Data Science', kh: '...' },
        save: jest.fn().mockImplementation(() => Promise.resolve(instance)),
      };
      jest.spyOn(Category, 'findById').mockResolvedValue(instance as any);
      jest.spyOn(Category, 'findOne').mockResolvedValue(null);

      const res = await request(app)
        .patch(`/api/v1/admin/categories/${validMongoId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          name: { en: 'AI & Data Science' },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Category updated successfully');
    });

    it('should return 400 when updating with invalid category type', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/categories/${validMongoId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          type: 'not-a-valid-type',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });
  });

  describe('DELETE /api/v1/admin/categories/:id', () => {
    it('should return 200 when category is deleted successfully', async () => {
      jest.spyOn(Category, 'findById').mockResolvedValue(mockCategory as any);
      jest.spyOn(Project, 'countDocuments').mockResolvedValue(0 as any);
      jest.spyOn(BlogPost, 'countDocuments').mockResolvedValue(0 as any);
      jest.spyOn(Category, 'findByIdAndDelete').mockResolvedValue(mockCategory as any);

      const res = await request(app)
        .delete(`/api/v1/admin/categories/${validMongoId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Category deleted successfully');
    });

    it('should return 409 Conflict when category is referenced by projects', async () => {
      jest.spyOn(Category, 'findById').mockResolvedValue(mockCategory as any);
      jest.spyOn(Project, 'countDocuments').mockResolvedValue(2 as any);
      jest.spyOn(BlogPost, 'countDocuments').mockResolvedValue(0 as any);

      const res = await request(app)
        .delete(`/api/v1/admin/categories/${validMongoId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('referenced by 2 project(s)');
    });
  });
});
