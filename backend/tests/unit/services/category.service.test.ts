import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import Category from '../../../src/models/Category';
import Project from '../../../src/models/Project';
import BlogPost from '../../../src/models/BlogPost';
import categoryService from '../../../src/services/category.service';
import { NotFoundError, ConflictError } from '../../../src/utils/AppError';

describe('CategoryService', () => {
  const dummyId = new mongoose.Types.ObjectId().toString();
  const mockCategoryInstance: any = {
    _id: dummyId,
    name: { en: 'Web Development', kh: 'ការអភិវឌ្ឍគេហទំព័រ' },
    slug: 'web-development',
    type: 'project',
    order: 1,
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCategoryInstance.save.mockResolvedValue(mockCategoryInstance);
    jest.spyOn(Category.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAll', () => {
    it('should query categories sorted by order and createdAt', async () => {
      const sortMock = {
        sort: jest.fn().mockImplementation(() => Promise.resolve([mockCategoryInstance])),
      };
      jest.spyOn(Category, 'find').mockReturnValue(sortMock as any);

      const result = await categoryService.getAll();

      expect(Category.find).toHaveBeenCalledWith({});
      expect(sortMock.sort).toHaveBeenCalledWith({ order: 1, createdAt: 1 });
      expect(result).toHaveLength(1);
    });

    it('should query with type filter allowing specific type and both', async () => {
      const sortMock = {
        sort: jest.fn().mockImplementation(() => Promise.resolve([mockCategoryInstance])),
      };
      jest.spyOn(Category, 'find').mockReturnValue(sortMock as any);

      await categoryService.getAll({ type: 'project' });

      expect(Category.find).toHaveBeenCalledWith({
        $or: [{ type: 'project' }, { type: 'both' }],
      });
    });
  });

  describe('getById', () => {
    it('should return category when found', async () => {
      jest.spyOn(Category, 'findById').mockResolvedValue(mockCategoryInstance as any);

      const result = await categoryService.getById(dummyId);

      expect(Category.findById).toHaveBeenCalledWith(dummyId);
      expect(result).toEqual(mockCategoryInstance);
    });

    it('should throw NotFoundError when category is not found', async () => {
      jest.spyOn(Category, 'findById').mockResolvedValue(null);

      await expect(categoryService.getById(dummyId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    it('should create and return category with generated slug', async () => {
      jest.spyOn(Category, 'findOne').mockResolvedValue(null);

      const categoryData = {
        name: { en: 'Mobile Apps', kh: 'កម្មវិធីទូរស័ព្ទ' },
        type: 'project' as const,
      };

      const result = await categoryService.create(categoryData);

      expect(Category.findOne).toHaveBeenCalledWith({ slug: 'mobile-apps' });
      expect(result).toBeDefined();
    });

    it('should throw ConflictError if category slug already exists', async () => {
      jest.spyOn(Category, 'findOne').mockResolvedValue(mockCategoryInstance as any);

      await expect(
        categoryService.create({
          name: { en: 'Web Development' },
          type: 'project',
        }),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('update', () => {
    it('should update and save category when valid', async () => {
      const instance: any = {
        ...mockCategoryInstance,
        name: { en: 'Web Development', kh: '...' },
        save: jest.fn().mockImplementation(() => Promise.resolve(instance)),
      };
      jest.spyOn(Category, 'findById').mockResolvedValue(instance as any);
      jest.spyOn(Category, 'findOne').mockResolvedValue(null);

      const updated = await categoryService.update(dummyId, {
        name: { en: 'Full-Stack Development' },
        order: 5,
      });

      expect(instance.name.en).toBe('Full-Stack Development');
      expect(instance.order).toBe(5);
      expect(instance.save).toHaveBeenCalled();
      expect(updated).toBeDefined();
    });

    it('should throw NotFoundError if category to update is not found', async () => {
      jest.spyOn(Category, 'findById').mockResolvedValue(null);

      await expect(
        categoryService.update(dummyId, { name: { en: 'New Name' } }),
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw ConflictError when changing to a slug already in use by another category', async () => {
      jest.spyOn(Category, 'findById').mockResolvedValue(mockCategoryInstance as any);
      jest.spyOn(Category, 'findOne').mockResolvedValue({ _id: 'other-id', slug: 'existing' } as any);

      await expect(
        categoryService.update(dummyId, { slug: 'existing' }),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('delete', () => {
    it('should delete category when not referenced', async () => {
      jest.spyOn(Category, 'findById').mockResolvedValue(mockCategoryInstance as any);
      jest.spyOn(Project, 'countDocuments').mockResolvedValue(0 as any);
      jest.spyOn(BlogPost, 'countDocuments').mockResolvedValue(0 as any);
      const deleteSpy = jest.spyOn(Category, 'findByIdAndDelete').mockResolvedValue(mockCategoryInstance as any);

      await categoryService.delete(dummyId);

      expect(Project.countDocuments).toHaveBeenCalledWith({ category: dummyId });
      expect(BlogPost.countDocuments).toHaveBeenCalledWith({ category: dummyId });
      expect(deleteSpy).toHaveBeenCalledWith(dummyId);
    });

    it('should throw ConflictError if category is referenced by projects', async () => {
      jest.spyOn(Category, 'findById').mockResolvedValue(mockCategoryInstance as any);
      jest.spyOn(Project, 'countDocuments').mockResolvedValue(3 as any);
      jest.spyOn(BlogPost, 'countDocuments').mockResolvedValue(0 as any);

      await expect(categoryService.delete(dummyId)).rejects.toThrow(ConflictError);
    });

    it('should throw ConflictError if category is referenced by blog posts', async () => {
      jest.spyOn(Category, 'findById').mockResolvedValue(mockCategoryInstance as any);
      jest.spyOn(Project, 'countDocuments').mockResolvedValue(0 as any);
      jest.spyOn(BlogPost, 'countDocuments').mockResolvedValue(2 as any);

      await expect(categoryService.delete(dummyId)).rejects.toThrow(ConflictError);
    });

    it('should throw NotFoundError if category does not exist', async () => {
      jest.spyOn(Category, 'findById').mockResolvedValue(null);

      await expect(categoryService.delete(dummyId)).rejects.toThrow(NotFoundError);
    });
  });
});
