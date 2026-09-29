import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import BlogPost from '../../../src/models/BlogPost';
import Category from '../../../src/models/Category';
import cloudinaryService from '../../../src/services/cloudinary.service';
import blogService, { extractPublicId } from '../../../src/services/blog.service';
import { NotFoundError } from '../../../src/utils/AppError';

describe('BlogService', () => {
  const dummyPostId = new mongoose.Types.ObjectId().toString();
  const dummyCategoryId = new mongoose.Types.ObjectId().toString();
  const dummyAuthorId = new mongoose.Types.ObjectId().toString();

  const mockCategoryInstance: any = {
    _id: dummyCategoryId,
    name: { en: 'Web Development', kh: 'ការអភិវឌ្ឍគេហទំព័រ' },
    slug: 'web-development',
    type: 'blog',
  };

  const mockPostInstance: any = {
    _id: dummyPostId,
    title: { en: 'Getting Started with Angular 19', kh: 'ការចាប់ផ្តើមជាមួយ Angular 19' },
    slug: 'getting-started-with-angular-19',
    excerpt: { en: 'A comprehensive guide to Angular 19', kh: 'ការណែនាំលម្អិត' },
    content: { en: '# Angular 19 Guide\nFull markdown content', kh: 'ខ្លឹមសារជាភាសាខ្មែរ' },
    coverImage: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/blog/angular19.webp',
    category: dummyCategoryId,
    author: dummyAuthorId,
    tags: ['angular', 'typescript'],
    status: 'draft',
    featured: false,
    readingTime: 3,
    viewCount: 0,
    save: jest.fn(),
    populate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPostInstance.save.mockResolvedValue(mockPostInstance);
    mockPostInstance.populate.mockResolvedValue(mockPostInstance);

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

  describe('extractPublicId', () => {
    it('should correctly extract public ID from Cloudinary URL', () => {
      const url = 'https://res.cloudinary.com/demo/image/upload/v123456789/portfolio/blog/cover_post.webp';
      expect(extractPublicId(url)).toBe('portfolio/blog/cover_post');
    });

    it('should return null for non-Cloudinary or invalid URL', () => {
      expect(extractPublicId('https://example.com/cover.png')).toBeNull();
      expect(extractPublicId('')).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should return paginated blog posts with filters and sorting', async () => {
      const mockQueryChain: any = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: (jest.fn() as any).mockResolvedValue([mockPostInstance]),
      };

      jest.spyOn(BlogPost, 'find').mockReturnValue(mockQueryChain as any);
      jest.spyOn(BlogPost, 'countDocuments').mockResolvedValue(1 as any);

      const result = await blogService.getAll({
        page: 1,
        limit: 10,
        status: 'draft',
        featured: 'false',
        category: dummyCategoryId,
        tag: 'angular',
        search: 'Angular',
      });

      expect(BlogPost.find).toHaveBeenCalled();
      expect(BlogPost.countDocuments).toHaveBeenCalled();
      expect(result.items).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
    });
  });

  describe('getById', () => {
    it('should return populated blog post when found', async () => {
      const mockPopulate: any = {
        populate: (jest.fn() as any).mockResolvedValue(mockPostInstance),
      };
      jest.spyOn(BlogPost, 'findById').mockReturnValue(mockPopulate as any);

      const result = await blogService.getById(dummyPostId);

      expect(BlogPost.findById).toHaveBeenCalledWith(dummyPostId);
      expect(result).toEqual(mockPostInstance);
    });

    it('should throw NotFoundError if post does not exist', async () => {
      const mockPopulate: any = {
        populate: (jest.fn() as any).mockResolvedValue(null),
      };
      jest.spyOn(BlogPost, 'findById').mockReturnValue(mockPopulate as any);

      await expect(blogService.getById(dummyPostId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    it('should throw NotFoundError if referenced category does not exist', async () => {
      jest.spyOn(Category, 'findById').mockResolvedValue(null);

      await expect(
        blogService.create(
          {
            title: { en: 'New Post' },
            excerpt: { en: 'Excerpt' },
            content: { en: 'Content' },
            category: dummyCategoryId,
          },
          dummyAuthorId,
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it('should create blog post with optional image upload and author ID', async () => {
      jest.spyOn(Category, 'findById').mockResolvedValue(mockCategoryInstance as any);
      const uploadSpy = jest.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue({
        publicId: 'uploaded_blog_cover',
        url: 'http://res.cloudinary.com/cover.jpg',
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/blog/uploaded_cover.webp',
        width: 1200,
        height: 630,
        format: 'webp',
        resourceType: 'image',
        bytes: 45000,
      });

      const mockFile = { buffer: Buffer.from('fake-cover') } as Express.Multer.File;

      const result = await blogService.create(
        {
          title: { en: 'Building APIs with Node.js' },
          excerpt: { en: 'Learn Express & Node' },
          content: { en: 'Comprehensive guide' },
          category: dummyCategoryId,
          tags: ['node', 'express'],
        },
        dummyAuthorId,
        mockFile,
      );

      expect(uploadSpy).toHaveBeenCalledWith(mockFile.buffer, 'portfolio/blog');
      expect(result).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update fields and clean up old cover image when new file is uploaded', async () => {
      const instance: any = {
        ...mockPostInstance,
        coverImage: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/blog/old_cover.webp',
        save: jest.fn().mockImplementation(() => Promise.resolve(instance)),
        populate: jest.fn().mockImplementation(() => Promise.resolve(instance)),
      };
      jest.spyOn(BlogPost, 'findById').mockResolvedValue(instance as any);
      jest.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue({
        publicId: 'new_cover',
        url: 'http://res.cloudinary.com/new_cover.jpg',
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/blog/new_cover.webp',
        width: 1200,
        height: 630,
        format: 'webp',
        resourceType: 'image',
        bytes: 45000,
      });
      const deleteSpy = jest.spyOn(cloudinaryService, 'deleteFile').mockResolvedValue({ result: 'ok' });

      const mockFile = { buffer: Buffer.from('new-cover') } as Express.Multer.File;

      const updated = await blogService.update(
        dummyPostId,
        {
          title: { en: 'Updated Angular 19 Guide' },
        },
        mockFile,
      );

      expect(deleteSpy).toHaveBeenCalledWith('portfolio/blog/old_cover');
      expect(instance.title.en).toBe('Updated Angular 19 Guide');
      expect(instance.save).toHaveBeenCalled();
      expect(updated).toBeDefined();
    });

    it('should throw NotFoundError if post to update does not exist', async () => {
      jest.spyOn(BlogPost, 'findById').mockResolvedValue(null);

      await expect(
        blogService.update(dummyPostId, { title: { en: 'Not Found' } }),
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if updated category does not exist', async () => {
      const instance = { ...mockPostInstance };
      jest.spyOn(BlogPost, 'findById').mockResolvedValue(instance as any);
      jest.spyOn(Category, 'findById').mockResolvedValue(null);

      await expect(
        blogService.update(dummyPostId, { category: dummyCategoryId }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete blog post and clean up Cloudinary cover image', async () => {
      const instance: any = {
        ...mockPostInstance,
        coverImage: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/blog/cover.webp',
      };
      jest.spyOn(BlogPost, 'findById').mockResolvedValue(instance as any);
      const deleteFileSpy = jest.spyOn(cloudinaryService, 'deleteFile').mockResolvedValue({ result: 'ok' });
      const deletePostSpy = jest.spyOn(BlogPost, 'findByIdAndDelete').mockResolvedValue(instance as any);

      await blogService.delete(dummyPostId);

      expect(deleteFileSpy).toHaveBeenCalledWith('portfolio/blog/cover');
      expect(deletePostSpy).toHaveBeenCalledWith(dummyPostId);
    });

    it('should throw NotFoundError if post to delete does not exist', async () => {
      jest.spyOn(BlogPost, 'findById').mockResolvedValue(null);

      await expect(blogService.delete(dummyPostId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('publish & unpublish', () => {
    it('should set status to published and set publishedAt', async () => {
      const instance: any = {
        ...mockPostInstance,
        status: 'draft',
        publishedAt: undefined,
        save: jest.fn().mockImplementation(() => Promise.resolve(instance)),
        populate: jest.fn().mockImplementation(() => Promise.resolve(instance)),
      };
      jest.spyOn(BlogPost, 'findById').mockResolvedValue(instance as any);

      const published = await blogService.publish(dummyPostId);

      expect(instance.status).toBe('published');
      expect(instance.publishedAt).toBeDefined();
      expect(instance.save).toHaveBeenCalled();
      expect(published).toBeDefined();
    });

    it('should set status to draft on unpublish', async () => {
      const instance: any = {
        ...mockPostInstance,
        status: 'published',
        save: jest.fn().mockImplementation(() => Promise.resolve(instance)),
        populate: jest.fn().mockImplementation(() => Promise.resolve(instance)),
      };
      jest.spyOn(BlogPost, 'findById').mockResolvedValue(instance as any);

      const unpublished = await blogService.unpublish(dummyPostId);

      expect(instance.status).toBe('draft');
      expect(instance.save).toHaveBeenCalled();
      expect(unpublished).toBeDefined();
    });
  });
});
