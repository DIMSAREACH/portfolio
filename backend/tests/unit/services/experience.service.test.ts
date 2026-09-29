import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import Experience from '../../../src/models/Experience';
import experienceService from '../../../src/services/experience.service';
import { NotFoundError } from '../../../src/utils/AppError';

describe('ExperienceService', () => {
  const dummyExperienceId = new mongoose.Types.ObjectId().toString();

  const mockExperienceInstance: any = {
    _id: dummyExperienceId,
    title: { en: 'Senior Full Stack Engineer', kh: 'វិស្វករ Full Stack ជាន់ខ្ពស់' },
    organization: { en: 'Tech Corp', kh: 'ក្រុមហ៊ុនតិច ខប' },
    location: { en: 'Phnom Penh, Cambodia', kh: 'ភ្នំពេញ កម្ពុជា' },
    type: 'work',
    startDate: new Date('2023-01-01'),
    endDate: undefined,
    isCurrent: true,
    description: { en: 'Leading full stack development', kh: 'ដឹកនាំការអភិវឌ្ឍ' },
    responsibilities: {
      en: ['Develop scalable microservices', 'Mentor junior developers'],
      kh: ['អភិវឌ្ឍ microservices', 'ជួយបណ្ដុះបណ្ដាលសមាជិកក្រុម'],
    },
    technologies: ['Angular', 'Node.js', 'Docker', 'MongoDB'],
    order: 1,
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockExperienceInstance.save.mockResolvedValue(mockExperienceInstance);

    jest.spyOn(Experience.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAll', () => {
    it('should return all experiences sorted by order and startDate when no pagination requested', async () => {
      const mockSort = {
        sort: jest.fn().mockImplementation(() => Promise.resolve([mockExperienceInstance])),
      };
      jest.spyOn(Experience, 'find').mockReturnValue(mockSort as any);

      const result = await experienceService.getAll({
        type: 'work',
        isCurrent: 'true',
        search: 'Tech',
      });

      expect(Experience.find).toHaveBeenCalled();
      expect(mockSort.sort).toHaveBeenCalledWith({ order: 1, startDate: -1 });
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });

    it('should return paginated experiences when page or limit is provided', async () => {
      const mockQueryChain: any = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: (jest.fn() as any).mockResolvedValue([mockExperienceInstance]),
      };

      jest.spyOn(Experience, 'find').mockReturnValue(mockQueryChain as any);
      jest.spyOn(Experience, 'countDocuments').mockResolvedValue(1 as any);

      const result = await experienceService.getAll({ page: 1, limit: 10 });

      expect(Experience.find).toHaveBeenCalled();
      expect(Experience.countDocuments).toHaveBeenCalled();
      expect('pagination' in result).toBe(true);
      if ('pagination' in result) {
        expect(result.items).toHaveLength(1);
        expect(result.pagination.total).toBe(1);
      }
    });
  });

  describe('getById', () => {
    it('should return experience when found', async () => {
      jest.spyOn(Experience, 'findById').mockResolvedValue(mockExperienceInstance as any);

      const result = await experienceService.getById(dummyExperienceId);

      expect(Experience.findById).toHaveBeenCalledWith(dummyExperienceId);
      expect(result).toEqual(mockExperienceInstance);
    });

    it('should throw NotFoundError if experience does not exist', async () => {
      jest.spyOn(Experience, 'findById').mockResolvedValue(null);

      await expect(experienceService.getById(dummyExperienceId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    it('should create and return experience with default kh values for title and organization', async () => {
      const result = await experienceService.create({
        title: { en: 'Backend Engineer' },
        organization: { en: 'Startup Labs' },
        type: 'work',
        startDate: '2022-01-01',
        isCurrent: false,
        endDate: '2023-01-01',
      });

      expect(result).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update experience fields and save', async () => {
      const instance: any = {
        ...mockExperienceInstance,
        title: { en: 'Lead Full Stack Engineer', kh: '...' },
        save: jest.fn().mockImplementation(() => Promise.resolve(instance)),
      };
      jest.spyOn(Experience, 'findById').mockResolvedValue(instance as any);

      const updated = await experienceService.update(dummyExperienceId, {
        title: { en: 'Lead Full Stack Engineer' },
        order: 2,
        isCurrent: false,
        endDate: '2024-01-01',
      });

      expect(instance.title.en).toBe('Lead Full Stack Engineer');
      expect(instance.order).toBe(2);
      expect(instance.isCurrent).toBe(false);
      expect(instance.save).toHaveBeenCalled();
      expect(updated).toBeDefined();
    });

    it('should throw NotFoundError if experience to update does not exist', async () => {
      jest.spyOn(Experience, 'findById').mockResolvedValue(null);

      await expect(
        experienceService.update(dummyExperienceId, { type: 'freelance' }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete experience when found', async () => {
      jest.spyOn(Experience, 'findById').mockResolvedValue(mockExperienceInstance as any);
      const deleteSpy = jest.spyOn(Experience, 'findByIdAndDelete').mockResolvedValue(mockExperienceInstance as any);

      await experienceService.delete(dummyExperienceId);

      expect(Experience.findById).toHaveBeenCalledWith(dummyExperienceId);
      expect(deleteSpy).toHaveBeenCalledWith(dummyExperienceId);
    });

    it('should throw NotFoundError if experience to delete does not exist', async () => {
      jest.spyOn(Experience, 'findById').mockResolvedValue(null);

      await expect(experienceService.delete(dummyExperienceId)).rejects.toThrow(NotFoundError);
    });
  });
});
