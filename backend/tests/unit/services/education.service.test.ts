import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import Education from '../../../src/models/Education';
import educationService from '../../../src/services/education.service';
import { NotFoundError } from '../../../src/utils/AppError';

describe('EducationService', () => {
  const dummyEducationId = new mongoose.Types.ObjectId().toString();

  const mockEducationInstance: any = {
    _id: dummyEducationId,
    institution: { en: 'Royal University of Phnom Penh', kh: 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ' },
    degree: { en: 'Bachelor of Science', kh: 'បរិញ្ញាបត្រវិទ្យាសាស្ត្រ' },
    field: { en: 'Computer Science', kh: 'វិទ្យាសាស្ត្រកុំព្យូទ័រ' },
    startYear: 2020,
    endYear: 2024,
    description: { en: 'Graduated with honors', kh: 'បញ្ចប់ការសិក្សាដោយកិត្តិយស' },
    activities: { en: ['IT Club Leader'], kh: ['ប្រធានក្លឹបព័ត៌មានវិទ្យា'] },
    gpa: '3.85 / 4.0',
    order: 1,
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockEducationInstance.save.mockResolvedValue(mockEducationInstance);

    jest.spyOn(Education.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAll', () => {
    it('should return all education entries sorted by order and startYear when pagination is not requested', async () => {
      const mockSort = {
        sort: jest.fn().mockImplementation(() => Promise.resolve([mockEducationInstance])),
      };
      jest.spyOn(Education, 'find').mockReturnValue(mockSort as any);

      const result = await educationService.getAll({ search: 'University' });

      expect(Education.find).toHaveBeenCalled();
      expect(mockSort.sort).toHaveBeenCalledWith({ order: 1, startYear: -1 });
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });

    it('should return paginated education entries when page or limit is provided', async () => {
      const mockQueryChain: any = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: (jest.fn() as any).mockResolvedValue([mockEducationInstance]),
      };

      jest.spyOn(Education, 'find').mockReturnValue(mockQueryChain as any);
      jest.spyOn(Education, 'countDocuments').mockResolvedValue(1 as any);

      const result = await educationService.getAll({ page: 1, limit: 10 });

      expect(Education.find).toHaveBeenCalled();
      expect(Education.countDocuments).toHaveBeenCalled();
      expect('pagination' in result).toBe(true);
      if ('pagination' in result) {
        expect(result.items).toHaveLength(1);
        expect(result.pagination.total).toBe(1);
      }
    });
  });

  describe('getById', () => {
    it('should return education entry when found', async () => {
      jest.spyOn(Education, 'findById').mockResolvedValue(mockEducationInstance as any);

      const result = await educationService.getById(dummyEducationId);

      expect(Education.findById).toHaveBeenCalledWith(dummyEducationId);
      expect(result).toEqual(mockEducationInstance);
    });

    it('should throw NotFoundError if education entry does not exist', async () => {
      jest.spyOn(Education, 'findById').mockResolvedValue(null);

      await expect(educationService.getById(dummyEducationId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    it('should create and return education entry with default kh values', async () => {
      const result = await educationService.create({
        institution: { en: 'Institute of Technology of Cambodia' },
        degree: { en: 'Engineering' },
        field: { en: 'Software Engineering' },
        startYear: 2019,
        endYear: 2023,
        gpa: '3.9 / 4.0',
      });

      expect(result).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update education fields and save', async () => {
      const instance: any = {
        ...mockEducationInstance,
        institution: { en: 'Updated University', kh: '...' },
        save: jest.fn().mockImplementation(() => Promise.resolve(instance)),
      };
      jest.spyOn(Education, 'findById').mockResolvedValue(instance as any);

      const updated = await educationService.update(dummyEducationId, {
        institution: { en: 'Updated University' },
        order: 3,
        endYear: 2025,
      });

      expect(instance.institution.en).toBe('Updated University');
      expect(instance.order).toBe(3);
      expect(instance.endYear).toBe(2025);
      expect(instance.save).toHaveBeenCalled();
      expect(updated).toBeDefined();
    });

    it('should throw NotFoundError if education entry to update does not exist', async () => {
      jest.spyOn(Education, 'findById').mockResolvedValue(null);

      await expect(
        educationService.update(dummyEducationId, { startYear: 2021 }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete education entry when found', async () => {
      jest.spyOn(Education, 'findById').mockResolvedValue(mockEducationInstance as any);
      const deleteSpy = jest.spyOn(Education, 'findByIdAndDelete').mockResolvedValue(mockEducationInstance as any);

      await educationService.delete(dummyEducationId);

      expect(Education.findById).toHaveBeenCalledWith(dummyEducationId);
      expect(deleteSpy).toHaveBeenCalledWith(dummyEducationId);
    });

    it('should throw NotFoundError if education entry to delete does not exist', async () => {
      jest.spyOn(Education, 'findById').mockResolvedValue(null);

      await expect(educationService.delete(dummyEducationId)).rejects.toThrow(NotFoundError);
    });
  });
});
