import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import app from '../../src/app';
import BlogPost from '../../src/models/BlogPost';
import Category from '../../src/models/Category';
import cloudinaryService from '../../src/services/cloudinary.service';
import { generateAccessToken } from '../../src/utils/jwt';

describe('Admin Blog Posts API Integration Tests (/api/v1/admin/blog)', () => {
  const dummyAdminId = new mongoose.Types.ObjectId().toString();
  const dummyAdminToken = generateAccessToken(dummyAdminId, 'admin');
  const validPostId = new mongoose.Types.ObjectId().toString();
  const validCategoryId = new mongoose.Types.ObjectId().toString();

  const mockCategory: any = {
    _id: validCategoryId,
    name: { en: 'Web Development', kh: 'ការអភិវឌ្ឍគេហទំព័រ' },
    slug: 'web-development',
    type: 'blog',
  };

  const mockPost: any = {
    _id: validPostId,
    title: { en: 'Understanding SSR in Angular', kh: 'ការយល់ដឹងអំពី SSR ក្នុង Angular' },
    slug: 'understanding-ssr-in-angular',
    excerpt: { en: 'Deep dive into Server-Side Rendering', kh: 'ការណែនាំស៊ីជម្រៅ' },
    content: { en: '# Angular SSR\nFull markdown content', kh: 'ខ្លឹមសារជាភាសាខ្មែរ' },
    category: mockCategory,
    author: { _id: 'admin-id-12345', name: 'Admin User', email: 'admin@portfolio.dev' },
    tags: ['angular', 'ssr'],
    status: 'draft',
    featured: false,
    readingTime: 4,
    viewCount: 0,
    save: jest.fn(),
    populate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPost.save.mockResolvedValue(mockPost);
    mockPost.populate.mockResolvedValue(mockPost);

    jest.spyOn(BlogPost.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
    jest.spyOn(BlogPost.prototype, 'populate').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/v1/admin/blog', () => {
    it('should return 200 and paginated blog posts list for admin', async () => {
      const mockQueryChain: any = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: (jest.fn() as any).mockResolvedValue([mockPost]),
      };

      jest.spyOn(BlogPost, 'find').mockReturnValue(mockQueryChain as any);
      jest.spyOn(BlogPost, 'countDocuments').mockResolvedValue(1 as any);

      const res = await request(app)
        .get('/api/v1/admin/blog')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.pagination.total).toBe(1);
    });

    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/v1/admin/blog');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/admin/blog/:id', () => {
    it('should return 200 and blog post for valid ID', async () => {
      const mockPopulate: any = {
        populate: (jest.fn() as any).mockResolvedValue(mockPost),
      };
      jest.spyOn(BlogPost, 'findById').mockReturnValue(mockPopulate as any);

      const res = await request(app)
        .get(`/api/v1/admin/blog/${validPostId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(validPostId);
    });

    it('should return 400 for invalid mongo ID format', async () => {
      const res = await request(app)
        .get('/api/v1/admin/blog/invalid-mongo-id')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });

    it('should return 404 when blog post is not found', async () => {
      const mockPopulate: any = {
        populate: (jest.fn() as any).mockResolvedValue(null),
      };
      jest.spyOn(BlogPost, 'findById').mockReturnValue(mockPopulate as any);

      const res = await request(app)
        .get(`/api/v1/admin/blog/${validPostId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/admin/blog', () => {
    it('should return 201 on successful blog post creation with cover image upload', async () => {
      jest.spyOn(Category, 'findById').mockResolvedValue(mockCategory as any);
      jest.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue({
        publicId: 'uploaded_cover',
        url: 'http://res.cloudinary.com/cover.jpg',
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/portfolio/blog/uploaded_cover.webp',
        width: 1200,
        height: 630,
        format: 'webp',
        resourceType: 'image',
        bytes: 45000,
      });

      const res = await request(app)
        .post('/api/v1/admin/blog')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .field('title[en]', 'Full-Stack TypeScript Guide')
        .field('title[kh]', 'ការណែនាំ Full-Stack TypeScript')
        .field('excerpt[en]', 'How to build full stack apps')
        .field('content[en]', '# Full Stack Guide')
        .field('category', validCategoryId)
        .field('tags', 'typescript, nodejs, angular')
        .attach('image', Buffer.from('fake-cover-bytes'), 'cover.png');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Blog post created successfully');
    });

    it('should return 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/admin/blog')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          title: {},
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });
  });

  describe('PATCH /api/v1/admin/blog/:id', () => {
    it('should return 200 on successful blog post update', async () => {
      const instance: any = {
        ...mockPost,
        title: { en: 'Updated Title', kh: '...' },
        save: jest.fn().mockImplementation(() => Promise.resolve(instance)),
        populate: jest.fn().mockImplementation(() => Promise.resolve(instance)),
      };
      jest.spyOn(BlogPost, 'findById').mockResolvedValue(instance as any);

      const res = await request(app)
        .patch(`/api/v1/admin/blog/${validPostId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          title: { en: 'Updated Title' },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Blog post updated successfully');
    });

    it('should return 404 when blog post to update does not exist', async () => {
      jest.spyOn(BlogPost, 'findById').mockResolvedValue(null);

      const res = await request(app)
        .patch(`/api/v1/admin/blog/${validPostId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          title: { en: 'Updated Title' },
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/admin/blog/:id', () => {
    it('should return 200 when blog post is deleted successfully', async () => {
      const instance: any = {
        ...mockPost,
        coverImage: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/blog/cover.webp',
      };
      jest.spyOn(BlogPost, 'findById').mockResolvedValue(instance as any);
      jest.spyOn(cloudinaryService, 'deleteFile').mockResolvedValue({ result: 'ok' });
      jest.spyOn(BlogPost, 'findByIdAndDelete').mockResolvedValue(instance as any);

      const res = await request(app)
        .delete(`/api/v1/admin/blog/${validPostId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Blog post deleted successfully');
    });

    it('should return 404 when blog post to delete does not exist', async () => {
      jest.spyOn(BlogPost, 'findById').mockResolvedValue(null);

      const res = await request(app)
        .delete(`/api/v1/admin/blog/${validPostId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Publish & Unpublish endpoints', () => {
    it('should publish blog post with 200', async () => {
      const instance: any = {
        ...mockPost,
        status: 'draft',
        save: jest.fn().mockImplementation(() => Promise.resolve(instance)),
        populate: jest.fn().mockImplementation(() => Promise.resolve(instance)),
      };
      jest.spyOn(BlogPost, 'findById').mockResolvedValue(instance as any);

      const res = await request(app)
        .patch(`/api/v1/admin/blog/${validPostId}/publish`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Blog post published successfully');
    });

    it('should unpublish blog post with 200', async () => {
      const instance: any = {
        ...mockPost,
        status: 'published',
        save: jest.fn().mockImplementation(() => Promise.resolve(instance)),
        populate: jest.fn().mockImplementation(() => Promise.resolve(instance)),
      };
      jest.spyOn(BlogPost, 'findById').mockResolvedValue(instance as any);

      const res = await request(app)
        .patch(`/api/v1/admin/blog/${validPostId}/unpublish`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Blog post unpublished successfully');
    });
  });
});
