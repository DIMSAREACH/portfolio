import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import app from '../../src/app';
import Project from '../../src/models/Project';
import Category from '../../src/models/Category';
import cloudinaryService from '../../src/services/cloudinary.service';
import { generateAccessToken } from '../../src/utils/jwt';

describe('Admin Projects API Integration Tests (/api/v1/admin/projects)', () => {
  const dummyAdminToken = generateAccessToken('admin-id-12345', 'admin');
  const validProjectId = new mongoose.Types.ObjectId().toString();
  const validCategoryId = new mongoose.Types.ObjectId().toString();

  const mockCategory: any = {
    _id: validCategoryId,
    name: { en: 'Web Development', kh: 'ការអភិវឌ្ឍគេហទំព័រ' },
    slug: 'web-development',
    type: 'project',
  };

  const mockProject: any = {
    _id: validProjectId,
    title: { en: 'Dev Portfolio', kh: 'គេហទំព័រផ្ទាល់ខ្លួន' },
    slug: 'dev-portfolio',
    shortDescription: { en: 'Full-stack portfolio', kh: 'ការពិពណ៌នាសង្ខេប' },
    fullDescription: { en: 'Detailed portfolio overview', kh: 'ការពិពណ៌នាពេញលេញ' },
    technologies: ['Angular', 'Node.js', 'MongoDB'],
    category: mockCategory,
    mainImage: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/projects/main.webp',
    screenshots: ['https://res.cloudinary.com/demo/image/upload/v12345/portfolio/projects/screen1.webp'],
    featured: true,
    status: 'published',
    order: 1,
    save: jest.fn(),
    populate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockProject.save.mockResolvedValue(mockProject);
    mockProject.populate.mockResolvedValue(mockProject);

    jest.spyOn(Project.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
    jest.spyOn(Project.prototype, 'populate').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/v1/admin/projects', () => {
    it('should return 200 and paginated projects list for admin', async () => {
      const mockQueryChain: any = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: (jest.fn() as any).mockResolvedValue([mockProject]),
      };

      jest.spyOn(Project, 'find').mockReturnValue(mockQueryChain as any);
      jest.spyOn(Project, 'countDocuments').mockResolvedValue(1 as any);

      const res = await request(app)
        .get('/api/v1/admin/projects')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.pagination.total).toBe(1);
    });

    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/v1/admin/projects');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/admin/projects/:id', () => {
    it('should return 200 and project for valid ID', async () => {
      const mockPopulate: any = {
        populate: (jest.fn() as any).mockResolvedValue(mockProject),
      };
      jest.spyOn(Project, 'findById').mockReturnValue(mockPopulate as any);

      const res = await request(app)
        .get(`/api/v1/admin/projects/${validProjectId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(validProjectId);
    });

    it('should return 400 for invalid mongo ID parameter', async () => {
      const res = await request(app)
        .get('/api/v1/admin/projects/not-a-valid-id')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });

    it('should return 404 when project is not found', async () => {
      const mockPopulate: any = {
        populate: (jest.fn() as any).mockResolvedValue(null),
      };
      jest.spyOn(Project, 'findById').mockReturnValue(mockPopulate as any);

      const res = await request(app)
        .get(`/api/v1/admin/projects/${validProjectId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/admin/projects', () => {
    it('should return 201 on successful project creation with image', async () => {
      jest.spyOn(Category, 'findById').mockResolvedValue(mockCategory as any);
      jest.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue({
        publicId: 'uploaded-main',
        url: 'http://res.cloudinary.com/main.jpg',
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/portfolio/projects/uploaded-main.webp',
        width: 800,
        height: 600,
        format: 'webp',
        resourceType: 'image',
        bytes: 12345,
      });

      const res = await request(app)
        .post('/api/v1/admin/projects')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .field('title[en]', 'E-Commerce Platform')
        .field('title[kh]', 'វេទិកាពាណិជ្ជកម្មអេឡិចត្រូនិច')
        .field('shortDescription[en]', 'Modern store platform')
        .field('fullDescription[en]', 'Built with modern stack')
        .field('category', validCategoryId)
        .field('technologies', 'Angular, Node.js')
        .attach('mainImage', Buffer.from('fake-image-bytes'), 'main.png');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Project created successfully');
    });

    it('should return 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/admin/projects')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          title: {},
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });
  });

  describe('PATCH /api/v1/admin/projects/:id', () => {
    it('should return 200 on successful project update', async () => {
      const instance: any = {
        ...mockProject,
        title: { en: 'Updated Portfolio', kh: '...' },
        save: jest.fn().mockImplementation(() => Promise.resolve(instance)),
        populate: jest.fn().mockImplementation(() => Promise.resolve(instance)),
      };
      jest.spyOn(Project, 'findById').mockResolvedValue(instance as any);

      const res = await request(app)
        .patch(`/api/v1/admin/projects/${validProjectId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          title: { en: 'Updated Portfolio' },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Project updated successfully');
    });

    it('should return 404 when project to update does not exist', async () => {
      jest.spyOn(Project, 'findById').mockResolvedValue(null);

      const res = await request(app)
        .patch(`/api/v1/admin/projects/${validProjectId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          title: { en: 'Updated Portfolio' },
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/admin/projects/:id', () => {
    it('should return 200 when project is deleted successfully', async () => {
      const instance: any = {
        ...mockProject,
        mainImage: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/projects/main.webp',
        screenshots: [],
      };
      jest.spyOn(Project, 'findById').mockResolvedValue(instance as any);
      jest.spyOn(cloudinaryService, 'deleteFile').mockResolvedValue({ result: 'ok' });
      jest.spyOn(Project, 'findByIdAndDelete').mockResolvedValue(instance as any);

      const res = await request(app)
        .delete(`/api/v1/admin/projects/${validProjectId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Project deleted successfully');
    });

    it('should return 404 when project does not exist', async () => {
      jest.spyOn(Project, 'findById').mockResolvedValue(null);

      const res = await request(app)
        .delete(`/api/v1/admin/projects/${validProjectId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
