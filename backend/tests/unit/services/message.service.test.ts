import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import Message from '../../../src/models/Message';
import messageService from '../../../src/services/message.service';
import { NotFoundError } from '../../../src/utils/AppError';

describe('MessageService', () => {
  const dummyMessageId = new mongoose.Types.ObjectId().toString();

  const mockMessageInstance: any = {
    _id: dummyMessageId,
    name: 'Sokha Meng',
    email: 'sokha@example.com',
    subject: 'Project Inquiry',
    message: 'Hello, I would like to discuss a freelance project opportunity.',
    isRead: false,
    isArchived: false,
    readAt: undefined,
    ipAddress: '127.0.0.1',
    createdAt: new Date('2026-03-15'),
    updatedAt: new Date('2026-03-15'),
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockMessageInstance.save.mockResolvedValue(mockMessageInstance);

    jest.spyOn(Message.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAll', () => {
    it('should return paginated messages with default parameters', async () => {
      const mockQueryChain = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockImplementation(() => Promise.resolve([mockMessageInstance])),
      };

      jest.spyOn(Message, 'find').mockReturnValue(mockQueryChain as any);
      jest.spyOn(Message, 'countDocuments').mockResolvedValue(1 as any);

      const result = await messageService.getAll();

      expect(Message.find).toHaveBeenCalledWith({});
      expect(mockQueryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockQueryChain.skip).toHaveBeenCalledWith(0);
      expect(mockQueryChain.limit).toHaveBeenCalledWith(10);
      expect(result.items).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
    });

    it('should filter by isRead, isArchived, and search keyword', async () => {
      const mockQueryChain = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockImplementation(() => Promise.resolve([mockMessageInstance])),
      };

      jest.spyOn(Message, 'find').mockReturnValue(mockQueryChain as any);
      jest.spyOn(Message, 'countDocuments').mockResolvedValue(1 as any);

      const result = await messageService.getAll({
        isRead: 'true',
        isArchived: 'false',
        search: 'freelance',
        page: 2,
        limit: 5,
      });

      expect(Message.find).toHaveBeenCalledWith({
        isRead: true,
        isArchived: false,
        $or: [
          { name: expect.any(RegExp) },
          { email: expect.any(RegExp) },
          { subject: expect.any(RegExp) },
          { message: expect.any(RegExp) },
        ],
      });
      expect(mockQueryChain.skip).toHaveBeenCalledWith(5);
      expect(mockQueryChain.limit).toHaveBeenCalledWith(5);
      expect(result.pagination.page).toBe(2);
    });
  });

  describe('getById', () => {
    it('should return the message if found', async () => {
      jest.spyOn(Message, 'findById').mockResolvedValue(mockMessageInstance as any);

      const result = await messageService.getById(dummyMessageId);

      expect(Message.findById).toHaveBeenCalledWith(dummyMessageId);
      expect(result.email).toBe('sokha@example.com');
    });

    it('should throw NotFoundError if message is not found', async () => {
      jest.spyOn(Message, 'findById').mockResolvedValue(null as any);

      await expect(messageService.getById(dummyMessageId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('markAsRead', () => {
    it('should set isRead to true and readAt to a date', async () => {
      const messageToUpdate = {
        ...mockMessageInstance,
        isRead: false,
        readAt: undefined,
        save: jest.fn().mockImplementation(function (this: any) {
          return Promise.resolve(this);
        }),
      };
      jest.spyOn(Message, 'findById').mockResolvedValue(messageToUpdate as any);

      const result = await messageService.markAsRead(dummyMessageId);

      expect(result.isRead).toBe(true);
      expect(result.readAt).toBeInstanceOf(Date);
      expect(messageToUpdate.save).toHaveBeenCalled();
    });

    it('should throw NotFoundError if message not found', async () => {
      jest.spyOn(Message, 'findById').mockResolvedValue(null as any);

      await expect(messageService.markAsRead(dummyMessageId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('markAsUnread', () => {
    it('should set isRead to false and clear readAt', async () => {
      const messageToUpdate = {
        ...mockMessageInstance,
        isRead: true,
        readAt: new Date(),
        save: jest.fn().mockImplementation(function (this: any) {
          return Promise.resolve(this);
        }),
      };
      jest.spyOn(Message, 'findById').mockResolvedValue(messageToUpdate as any);

      const result = await messageService.markAsUnread(dummyMessageId);

      expect(result.isRead).toBe(false);
      expect(result.readAt).toBeUndefined();
      expect(messageToUpdate.save).toHaveBeenCalled();
    });

    it('should throw NotFoundError if message not found', async () => {
      jest.spyOn(Message, 'findById').mockResolvedValue(null as any);

      await expect(messageService.markAsUnread(dummyMessageId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('archive', () => {
    it('should set isArchived to true', async () => {
      const messageToUpdate = {
        ...mockMessageInstance,
        isArchived: false,
        save: jest.fn().mockImplementation(function (this: any) {
          return Promise.resolve(this);
        }),
      };
      jest.spyOn(Message, 'findById').mockResolvedValue(messageToUpdate as any);

      const result = await messageService.archive(dummyMessageId);

      expect(result.isArchived).toBe(true);
      expect(messageToUpdate.save).toHaveBeenCalled();
    });

    it('should throw NotFoundError if message not found', async () => {
      jest.spyOn(Message, 'findById').mockResolvedValue(null as any);

      await expect(messageService.archive(dummyMessageId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('unarchive', () => {
    it('should set isArchived to false', async () => {
      const messageToUpdate = {
        ...mockMessageInstance,
        isArchived: true,
        save: jest.fn().mockImplementation(function (this: any) {
          return Promise.resolve(this);
        }),
      };
      jest.spyOn(Message, 'findById').mockResolvedValue(messageToUpdate as any);

      const result = await messageService.unarchive(dummyMessageId);

      expect(result.isArchived).toBe(false);
      expect(messageToUpdate.save).toHaveBeenCalled();
    });

    it('should throw NotFoundError if message not found', async () => {
      jest.spyOn(Message, 'findById').mockResolvedValue(null as any);

      await expect(messageService.unarchive(dummyMessageId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('should remove message when found', async () => {
      jest.spyOn(Message, 'findById').mockResolvedValue(mockMessageInstance as any);
      jest.spyOn(Message, 'findByIdAndDelete').mockResolvedValue(mockMessageInstance as any);

      await messageService.delete(dummyMessageId);

      expect(Message.findById).toHaveBeenCalledWith(dummyMessageId);
      expect(Message.findByIdAndDelete).toHaveBeenCalledWith(dummyMessageId);
    });

    it('should throw NotFoundError if message not found', async () => {
      jest.spyOn(Message, 'findById').mockResolvedValue(null as any);

      await expect(messageService.delete(dummyMessageId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    it('should create and save a new message document', async () => {
      const data = {
        name: 'Dara Vann',
        email: 'dara@example.com',
        subject: 'Job Offer',
        message: 'We are hiring a Lead Frontend Engineer.',
      };

      const result = await messageService.create(data);

      expect(result.name).toBe(data.name);
      expect(result.email).toBe(data.email);
    });
  });
});
