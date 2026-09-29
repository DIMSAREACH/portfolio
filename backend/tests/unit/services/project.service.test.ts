import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import Project from '../../../src/models/Project';
import Category from '../../../src/models/Category';
import cloudinaryService from '../../../src/services/cloudinary.service';
import projectService, { extractPublicId } from '../../../src/services/project.service';
import { NotFoundError, ValidationError } from '../../../src/utils/AppError';

describe('ProjectService', () => {
  const dummyProjectId = new mongoose.Types.ObjectId().toString();
  const dummyCategoryId = new mongoose.Types.ObjectId().toString();

  const mockCategoryInstance: any = {
    _id: dummyCategoryId,
    name: { en: 'Web Development', kh: 'ការអភិវឌ្ឍគេហទំព័រ' },
    slug: 'web-development',
    type: 'project',
  };

  const mockProjectInstance: any = {
    _id: dummyProjectId,
    title: { en: 'Portfolio Website', kh: 'គេហទំព័រផ្ទាល់ខ្លួន' },
    slug: 'portfolio-website',
    shortDescription: { en: 'A great portfolio', kh: 'គេហទំព័រល្អ' },
    fullDescription: { en: 'Full description of portfolio', kh: 'ការពិពណ៌នាពេញលេញ' },
    technologies: ['Angular', 'Node.js', 'MongoDB'],
    category: dummyCategoryId,
    mainImage: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/projects/main.webp',
    screenshots: ['https://res.cloudinary.com/demo/image/upload/v12345/portfolio/projects/screen1.webp'],
    status: 'published',
    featured: true,
    order: 1,
    save: jest.fn(),
    populate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockProjectInstance.save.mockResolvedValue(mockProjectInstance);
    mockProjectInstance.populate.mockResolvedValue(mockProjectInstance);

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

  describe('extractPublicId', () => {
    it('should correctly parse public ID from standard Cloudinary URL', () => {
      const url = 'https://res.cloudinary.com/demo/image/upload/v123456789/portfolio/projects/test_img.webp';
      expect(extractPublicId(url)).toBe('portfolio/projects/test_img');
    });

    it('should return null for invalid or non-Cloudinary URLs', () => {
      expect(extractPublicId('https://example.com/image.jpg')).toBeNull();
      expect(extractPublicId('')).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should return paginated projects with filters and default sorting', async () => {
      const mockQueryChain: any = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: (jest.fn() as any).mockResolvedValue([mockProjectInstance]),
      };

      jest.spyOn(Project, 'find').mockReturnValue(mockQueryChain as any);
      jest.spyOn(Project, 'countDocuments').mockResolvedValue(1 as any);

      const result = await projectService.getAll({
        page: 1,
        limit: 10,
        status: 'published',
        featured: 'true',
        category: dummyCategoryId,
        tech: 'Node.js',
        search: 'Portfolio',
      });

      expect(Project.find).toHaveBeenCalled();
      expect(Project.countDocuments).toHaveBeenCalled();
      expect(result.items).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
    });

    it('should resolve category by slug when category param is not an ObjectId', async () => {
      const mockQueryChain: any = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: (jest.fn() as any).mockResolvedValue([mockProjectInstance]),
      };

      jest.spyOn(Category, 'findOne').mockResolvedValue(mockCategoryInstance as any);
      jest.spyOn(Project, 'find').mockReturnValue(mockQueryChain as any);
      jest.spyOn(Project, 'countDocuments').mockResolvedValue(1 as any);

      await projectService.getAll({ category: 'web-development' });

      expect(Category.findOne).toHaveBeenCalledWith({ slug: 'web-development' });
      expect(Project.find).toHaveBeenCalledWith(
        expect.objectContaining({ category: dummyCategoryId }),
      );
    });
  });

  describe('getById', () => {
    it('should return populated project when found', async () => {
      const mockPopulate: any = {
        populate: (jest.fn() as any).mockResolvedValue(mockProjectInstance),
      };
      jest.spyOn(Project, 'findById').mockReturnValue(mockPopulate as any);

      const result = await projectService.getById(dummyProjectId);

      expect(Project.findById).toHaveBeenCalledWith(dummyProjectId);
      expect(result).toEqual(mockProjectInstance);
    });

    it('should throw NotFoundError if project does not exist', async () => {
      const mockPopulate: any = {
        populate: (jest.fn() as any).mockResolvedValue(null),
      };
      jest.spyOn(Project, 'findById').mockReturnValue(mockPopulate as any);

      await expect(projectService.getById(dummyProjectId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('getBySlug', () => {
    it('should return project by slug without incrementing views when incrementViews is false', async () => {
      const mockPopulate: any = {
        populate: (jest.fn() as any).mockResolvedValue(mockProjectInstance),
      };
      jest.spyOn(Project, 'findOne').mockReturnValue(mockPopulate as any);

      const result = await projectService.getBySlug('portfolio-website');

      expect(Project.findOne).toHaveBeenCalledWith({ slug: 'portfolio-website' });
      expect(result).toEqual(mockProjectInstance);
    });

    it('should atomically increment viewCount when incrementViews is true', async () => {
      const mockPopulate: any = {
        populate: (jest.fn() as any).mockResolvedValue({
          ...mockProjectInstance,
          viewCount: 1,
        }),
      };
      jest.spyOn(Project, 'findOneAndUpdate').mockReturnValue(mockPopulate as any);

      const result = await projectService.getBySlug('portfolio-website', {
        incrementViews: true,
        publishedOnly: true,
      });

      expect(Project.findOneAndUpdate).toHaveBeenCalledWith(
        { slug: 'portfolio-website', status: 'published' },
        { $inc: { viewCount: 1 } },
        { new: true },
      );
      expect(result.viewCount).toBe(1);
    });

    it('should throw NotFoundError if project is not found', async () => {
      const mockPopulate: any = {
        populate: (jest.fn() as any).mockResolvedValue(null),
      };
      jest.spyOn(Project, 'findOne').mockReturnValue(mockPopulate as any);

      await expect(projectService.getBySlug('non-existent')).rejects.toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    it('should throw NotFoundError if referenced category does not exist', async () => {
      jest.spyOn(Category, 'findById').mockResolvedValue(null);

      await expect(
        projectService.create({
          title: { en: 'New Project' },
          shortDescription: { en: 'Short' },
          fullDescription: { en: 'Full' },
          technologies: ['React'],
          category: dummyCategoryId,
        }),
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw ValidationError if mainImage is missing and no file is uploaded', async () => {
      jest.spyOn(Category, 'findById').mockResolvedValue(mockCategoryInstance as any);

      await expect(
        projectService.create({
          title: { en: 'New Project' },
          shortDescription: { en: 'Short' },
          fullDescription: { en: 'Full' },
          technologies: ['React'],
          category: dummyCategoryId,
        }),
      ).rejects.toThrow(ValidationError);
    });

    it('should upload mainImage and screenshots to Cloudinary and create project', async () => {
      jest.spyOn(Category, 'findById').mockResolvedValue(mockCategoryInstance as any);
      const uploadSpy = jest.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue({
        publicId: 'uploaded_id',
        url: 'http://res.cloudinary.com/uploaded.jpg',
        secureUrl: 'https://res.cloudinary.com/uploaded.webp',
        width: 800,
        height: 600,
        format: 'webp',
        resourceType: 'image',
        bytes: 12345,
      });

      const mockFiles = {
        mainImage: [{ buffer: Buffer.from('img') }] as Express.Multer.File[],
        screenshots: [{ buffer: Buffer.from('screen') }] as Express.Multer.File[],
      };

      const result = await projectService.create(
        {
          title: { en: 'New Project' },
          shortDescription: { en: 'Short desc' },
          fullDescription: { en: 'Full desc' },
          technologies: ['React', 'Node'],
          category: dummyCategoryId,
        },
        mockFiles,
      );

      expect(uploadSpy).toHaveBeenCalledTimes(2);
      expect(result).toBeDefined();
    });
  });

  describe('update', () => {
    it('should throw NotFoundError if project does not exist', async () => {
      jest.spyOn(Project, 'findById').mockResolvedValue(null);

      await expect(
        projectService.update(dummyProjectId, { title: { en: 'Updated' } }),
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if updated category does not exist', async () => {
      const instance = { ...mockProjectInstance };
      jest.spyOn(Project, 'findById').mockResolvedValue(instance as any);
      jest.spyOn(Category, 'findById').mockResolvedValue(null);

      await expect(
        projectService.update(dummyProjectId, { category: dummyCategoryId }),
      ).rejects.toThrow(NotFoundError);
    });

    it('should update project fields and delete old image when new mainImage is provided', async () => {
      const instance: any = {
        ...mockProjectInstance,
        mainImage: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/projects/old_main.webp',
        save: jest.fn().mockImplementation(() => Promise.resolve(instance)),
        populate: jest.fn().mockImplementation(() => Promise.resolve(instance)),
      };
      jest.spyOn(Project, 'findById').mockResolvedValue(instance as any);
      jest.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue({
        publicId: 'portfolio/projects/new_main',
        url: 'http://res.cloudinary.com/new.jpg',
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/projects/new_main.webp',
        width: 800,
        height: 600,
        format: 'webp',
        resourceType: 'image',
        bytes: 12345,
      });
      const deleteFileSpy = jest.spyOn(cloudinaryService, 'deleteFile').mockResolvedValue({
        result: 'ok',
      });

      const mockFiles = {
        mainImage: [{ buffer: Buffer.from('new-img') }] as Express.Multer.File[],
      };

      const result = await projectService.update(
        dummyProjectId,
        { title: { en: 'Updated Title' } },
        mockFiles,
      );

      expect(deleteFileSpy).toHaveBeenCalledWith('portfolio/projects/old_main');
      expect(instance.title.en).toBe('Updated Title');
      expect(result).toBeDefined();
    });
  });

  describe('delete', () => {
    it('should delete project and clean up its Cloudinary assets', async () => {
      const instance = {
        ...mockProjectInstance,
        mainImage: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/projects/main.webp',
        screenshots: ['https://res.cloudinary.com/demo/image/upload/v12345/portfolio/projects/screen.webp'],
      };
      jest.spyOn(Project, 'findById').mockResolvedValue(instance as any);
      const deleteFileSpy = jest.spyOn(cloudinaryService, 'deleteFile').mockResolvedValue({ result: 'ok' });
      const deleteProjectSpy = jest.spyOn(Project, 'findByIdAndDelete').mockResolvedValue(instance as any);

      await projectService.delete(dummyProjectId);

      expect(deleteFileSpy).toHaveBeenCalledTimes(2);
      expect(deleteProjectSpy).toHaveBeenCalledWith(dummyProjectId);
    });

    it('should throw NotFoundError if project to delete does not exist', async () => {
      jest.spyOn(Project, 'findById').mockResolvedValue(null);

      await expect(projectService.delete(dummyProjectId)).rejects.toThrow(NotFoundError);
    });
  });
});
