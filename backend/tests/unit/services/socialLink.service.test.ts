import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import SocialLink from '../../../src/models/SocialLink';
import socialLinkService from '../../../src/services/socialLink.service';
import { NotFoundError } from '../../../src/utils/AppError';

describe('SocialLinkService', () => {
  const dummyLinkId = new mongoose.Types.ObjectId().toString();

  const mockSocialLinkInstance: any = {
    _id: dummyLinkId,
    platform: 'github',
    label: 'GitHub',
    url: 'https://github.com/dimasreach',
    icon: 'tabler:brand-github',
    order: 1,
    isVisible: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSocialLinkInstance.save.mockResolvedValue(mockSocialLinkInstance);

    jest.spyOn(SocialLink.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAll', () => {
    it('should return all social links sorted by order and createdAt', async () => {
      const mockQueryChain = {
        sort: jest.fn().mockImplementation(() => Promise.resolve([mockSocialLinkInstance])),
      };
      jest.spyOn(SocialLink, 'find').mockReturnValue(mockQueryChain as any);

      const result = await socialLinkService.getAll();

      expect(SocialLink.find).toHaveBeenCalledWith({});
      expect(mockQueryChain.sort).toHaveBeenCalledWith({ order: 1, createdAt: 1 });
      expect(result).toHaveLength(1);
    });

    it('should filter by isVisible flag', async () => {
      const mockQueryChain = {
        sort: jest.fn().mockImplementation(() => Promise.resolve([mockSocialLinkInstance])),
      };
      jest.spyOn(SocialLink, 'find').mockReturnValue(mockQueryChain as any);

      await socialLinkService.getAll({ isVisible: 'true' });

      expect(SocialLink.find).toHaveBeenCalledWith({ isVisible: true });
    });
  });

  describe('getById', () => {
    it('should return social link when found', async () => {
      jest.spyOn(SocialLink, 'findById').mockResolvedValue(mockSocialLinkInstance as any);

      const result = await socialLinkService.getById(dummyLinkId);

      expect(SocialLink.findById).toHaveBeenCalledWith(dummyLinkId);
      expect(result.platform).toBe('github');
    });

    it('should throw NotFoundError when not found', async () => {
      jest.spyOn(SocialLink, 'findById').mockResolvedValue(null as any);

      await expect(socialLinkService.getById(dummyLinkId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    it('should auto-increment order if order is not provided', async () => {
      const mockHighest = {
        sort: jest.fn().mockReturnThis(),
        select: (jest.fn() as any).mockResolvedValue({ order: 5 }),
      };
      jest.spyOn(SocialLink, 'findOne').mockReturnValue(mockHighest as any);

      const data = {
        platform: 'linkedin' as const,
        label: 'LinkedIn',
        url: 'https://linkedin.com/in/dimasreach',
      };

      const result = await socialLinkService.create(data);

      expect(result.order).toBe(6);
      expect(result.platform).toBe('linkedin');
    });

    it('should use explicit order if provided', async () => {
      const data = {
        platform: 'twitter' as const,
        label: 'Twitter',
        url: 'https://twitter.com/dimasreach',
        order: 10,
      };

      const result = await socialLinkService.create(data);

      expect(result.order).toBe(10);
      expect(result.platform).toBe('twitter');
    });
  });

  describe('update', () => {
    it('should update social link fields and save', async () => {
      const linkToUpdate = {
        ...mockSocialLinkInstance,
        save: jest.fn().mockImplementation(function (this: any) {
          return Promise.resolve(this);
        }),
      };
      jest.spyOn(SocialLink, 'findById').mockResolvedValue(linkToUpdate as any);

      const result = await socialLinkService.update(dummyLinkId, {
        label: 'GitHub Profile',
        order: 2,
      });

      expect(linkToUpdate.save).toHaveBeenCalled();
      expect(result.label).toBe('GitHub Profile');
      expect(result.order).toBe(2);
    });

    it('should throw NotFoundError if social link to update not found', async () => {
      jest.spyOn(SocialLink, 'findById').mockResolvedValue(null as any);

      await expect(
        socialLinkService.update(dummyLinkId, { label: 'New Label' }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete social link when found', async () => {
      jest.spyOn(SocialLink, 'findById').mockResolvedValue(mockSocialLinkInstance as any);
      jest.spyOn(SocialLink, 'findByIdAndDelete').mockResolvedValue(mockSocialLinkInstance as any);

      await socialLinkService.delete(dummyLinkId);

      expect(SocialLink.findById).toHaveBeenCalledWith(dummyLinkId);
      expect(SocialLink.findByIdAndDelete).toHaveBeenCalledWith(dummyLinkId);
    });

    it('should throw NotFoundError if social link to delete not found', async () => {
      jest.spyOn(SocialLink, 'findById').mockResolvedValue(null as any);

      await expect(socialLinkService.delete(dummyLinkId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('reorder', () => {
    it('should execute bulkWrite with updated orders and return sorted social links', async () => {
      jest.spyOn(SocialLink, 'bulkWrite').mockResolvedValue({} as any);
      const mockQueryChain = {
        sort: jest.fn().mockImplementation(() => Promise.resolve([mockSocialLinkInstance])),
      };
      jest.spyOn(SocialLink, 'find').mockReturnValue(mockQueryChain as any);

      const items = [{ id: dummyLinkId, order: 0 }];
      const result = await socialLinkService.reorder(items);

      expect(SocialLink.bulkWrite).toHaveBeenCalledWith([
        {
          updateOne: {
            filter: { _id: dummyLinkId },
            update: { $set: { order: 0 } },
          },
        },
      ]);
      expect(result).toHaveLength(1);
    });
  });
});
