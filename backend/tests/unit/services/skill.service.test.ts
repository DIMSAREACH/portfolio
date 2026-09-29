import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import Skill from '../../../src/models/Skill';
import skillService from '../../../src/services/skill.service';
import { NotFoundError } from '../../../src/utils/AppError';

describe('SkillService', () => {
  const dummySkillId = new mongoose.Types.ObjectId().toString();

  const mockSkillInstance: any = {
    _id: dummySkillId,
    name: 'TypeScript',
    category: { en: 'Programming Languages', kh: 'ភាសាសរសេរកូដ' },
    icon: 'typescript-icon',
    order: 1,
    isVisible: true,
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSkillInstance.save.mockResolvedValue(mockSkillInstance);

    jest.spyOn(Skill.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAll', () => {
    it('should return all skills sorted by order and createdAt when pagination is not requested', async () => {
      const mockSort = {
        sort: jest.fn().mockImplementation(() => Promise.resolve([mockSkillInstance])),
      };
      jest.spyOn(Skill, 'find').mockReturnValue(mockSort as any);

      const result = await skillService.getAll({ category: 'Programming', isVisible: 'true', search: 'Type' });

      expect(Skill.find).toHaveBeenCalled();
      expect(mockSort.sort).toHaveBeenCalledWith({ order: 1, createdAt: 1 });
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });

    it('should return paginated skills when page or limit is provided', async () => {
      const mockQueryChain: any = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: (jest.fn() as any).mockResolvedValue([mockSkillInstance]),
      };

      jest.spyOn(Skill, 'find').mockReturnValue(mockQueryChain as any);
      jest.spyOn(Skill, 'countDocuments').mockResolvedValue(1 as any);

      const result = await skillService.getAll({ page: 1, limit: 10 });

      expect(Skill.find).toHaveBeenCalled();
      expect(Skill.countDocuments).toHaveBeenCalled();
      expect('pagination' in result).toBe(true);
      if ('pagination' in result) {
        expect(result.items).toHaveLength(1);
        expect(result.pagination.total).toBe(1);
      }
    });
  });

  describe('getById', () => {
    it('should return skill when found', async () => {
      jest.spyOn(Skill, 'findById').mockResolvedValue(mockSkillInstance as any);

      const result = await skillService.getById(dummySkillId);

      expect(Skill.findById).toHaveBeenCalledWith(dummySkillId);
      expect(result).toEqual(mockSkillInstance);
    });

    it('should throw NotFoundError if skill does not exist', async () => {
      jest.spyOn(Skill, 'findById').mockResolvedValue(null);

      await expect(skillService.getById(dummySkillId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    it('should create skill with default kh category if omitted', async () => {
      const result = await skillService.create({
        name: 'Angular',
        category: { en: 'Frontend' },
        icon: 'angular-icon',
        order: 2,
        isVisible: true,
      });

      expect(result).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update skill fields and save', async () => {
      const instance: any = {
        ...mockSkillInstance,
        name: 'TypeScript',
        category: { en: 'Languages', kh: 'Languages' },
        save: jest.fn().mockImplementation(() => Promise.resolve(instance)),
      };
      jest.spyOn(Skill, 'findById').mockResolvedValue(instance as any);

      const updated = await skillService.update(dummySkillId, {
        name: 'TypeScript 5',
        category: { en: 'Languages & Tools' },
        icon: 'new-icon',
        order: 5,
        isVisible: false,
      });

      expect(instance.name).toBe('TypeScript 5');
      expect(instance.category.en).toBe('Languages & Tools');
      expect(instance.icon).toBe('new-icon');
      expect(instance.order).toBe(5);
      expect(instance.isVisible).toBe(false);
      expect(instance.save).toHaveBeenCalled();
      expect(updated).toBeDefined();
    });

    it('should throw NotFoundError if skill to update does not exist', async () => {
      jest.spyOn(Skill, 'findById').mockResolvedValue(null);

      await expect(
        skillService.update(dummySkillId, { name: 'Non-existent' }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete skill when found', async () => {
      jest.spyOn(Skill, 'findById').mockResolvedValue(mockSkillInstance as any);
      const deleteSpy = jest.spyOn(Skill, 'findByIdAndDelete').mockResolvedValue(mockSkillInstance as any);

      await skillService.delete(dummySkillId);

      expect(Skill.findById).toHaveBeenCalledWith(dummySkillId);
      expect(deleteSpy).toHaveBeenCalledWith(dummySkillId);
    });

    it('should throw NotFoundError if skill to delete does not exist', async () => {
      jest.spyOn(Skill, 'findById').mockResolvedValue(null);

      await expect(skillService.delete(dummySkillId)).rejects.toThrow(NotFoundError);
    });
  });
});
