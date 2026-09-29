import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import app from '../../src/app';
import Message from '../../src/models/Message';
import { generateAccessToken } from '../../src/utils/jwt';

describe('Admin Messages API Integration Tests (/api/v1/admin/messages)', () => {
  const dummyAdminToken = generateAccessToken('admin-user-id', 'admin');
  const dummyUserToken = generateAccessToken('normal-user-id', 'user');
  const validMessageId = new mongoose.Types.ObjectId().toString();

  const mockMessage: any = {
    _id: validMessageId,
    name: 'Chan Sopheak',
    email: 'sopheak@example.com',
    subject: 'Project Inquiry',
    message: 'Hello! I need a web app built.',
    isRead: false,
    isArchived: false,
    readAt: undefined,
    ipAddress: '192.168.1.1',
    createdAt: new Date('2026-03-20'),
    updatedAt: new Date('2026-03-20'),
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockMessage.save.mockResolvedValue(mockMessage);
    jest.spyOn(Message.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/v1/admin/messages', () => {
    it('should return 200 and paginated messages for admin', async () => {
      const mockQueryChain = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockImplementation(() => Promise.resolve([mockMessage])),
      };
      jest.spyOn(Message, 'find').mockReturnValue(mockQueryChain as any);
      jest.spyOn(Message, 'countDocuments').mockResolvedValue(1 as any);

      const res = await request(app)
        .get('/api/v1/admin/messages')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.pagination).toBeDefined();
      expect(res.body.data.pagination.total).toBe(1);
      expect(res.body.data.items[0].email).toBe('sopheak@example.com');
    });

    it('should filter messages by isRead, isArchived, and search', async () => {
      const mockQueryChain = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockImplementation(() => Promise.resolve([mockMessage])),
      };
      jest.spyOn(Message, 'find').mockReturnValue(mockQueryChain as any);
      jest.spyOn(Message, 'countDocuments').mockResolvedValue(1 as any);

      const res = await request(app)
        .get('/api/v1/admin/messages?isRead=false&isArchived=false&search=web')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Message.find).toHaveBeenCalledWith({
        isRead: false,
        isArchived: false,
        $or: expect.any(Array),
      });
    });

    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/v1/admin/messages');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject non-admin request with 403', async () => {
      const res = await request(app)
        .get('/api/v1/admin/messages')
        .set('Authorization', `Bearer ${dummyUserToken}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/admin/messages/:id', () => {
    it('should return 200 and message for valid ID', async () => {
      jest.spyOn(Message, 'findById').mockResolvedValue(mockMessage as any);

      const res = await request(app)
        .get(`/api/v1/admin/messages/${validMessageId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.subject).toBe('Project Inquiry');
    });

    it('should reject invalid mongo ID with 400', async () => {
      const res = await request(app)
        .get('/api/v1/admin/messages/invalid-id')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 if message not found', async () => {
      jest.spyOn(Message, 'findById').mockResolvedValue(null as any);

      const res = await request(app)
        .get(`/api/v1/admin/messages/${validMessageId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/v1/admin/messages/:id/read', () => {
    it('should mark message as read', async () => {
      const targetMessage = {
        ...mockMessage,
        isRead: false,
        readAt: undefined,
        save: jest.fn().mockImplementation(function (this: any) {
          return Promise.resolve(this);
        }),
      };
      jest.spyOn(Message, 'findById').mockResolvedValue(targetMessage as any);

      const res = await request(app)
        .patch(`/api/v1/admin/messages/${validMessageId}/read`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(targetMessage.isRead).toBe(true);
      expect(targetMessage.readAt).toBeDefined();
    });

    it('should return 404 when marking non-existent message as read', async () => {
      jest.spyOn(Message, 'findById').mockResolvedValue(null as any);

      const res = await request(app)
        .patch(`/api/v1/admin/messages/${validMessageId}/read`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/v1/admin/messages/:id/unread', () => {
    it('should mark message as unread', async () => {
      const targetMessage = {
        ...mockMessage,
        isRead: true,
        readAt: new Date(),
        save: jest.fn().mockImplementation(function (this: any) {
          return Promise.resolve(this);
        }),
      };
      jest.spyOn(Message, 'findById').mockResolvedValue(targetMessage as any);

      const res = await request(app)
        .patch(`/api/v1/admin/messages/${validMessageId}/unread`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(targetMessage.isRead).toBe(false);
      expect(targetMessage.readAt).toBeUndefined();
    });
  });

  describe('PATCH /api/v1/admin/messages/:id/archive', () => {
    it('should archive message', async () => {
      const targetMessage = {
        ...mockMessage,
        isArchived: false,
        save: jest.fn().mockImplementation(function (this: any) {
          return Promise.resolve(this);
        }),
      };
      jest.spyOn(Message, 'findById').mockResolvedValue(targetMessage as any);

      const res = await request(app)
        .patch(`/api/v1/admin/messages/${validMessageId}/archive`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(targetMessage.isArchived).toBe(true);
    });
  });

  describe('PATCH /api/v1/admin/messages/:id/unarchive', () => {
    it('should unarchive message', async () => {
      const targetMessage = {
        ...mockMessage,
        isArchived: true,
        save: jest.fn().mockImplementation(function (this: any) {
          return Promise.resolve(this);
        }),
      };
      jest.spyOn(Message, 'findById').mockResolvedValue(targetMessage as any);

      const res = await request(app)
        .patch(`/api/v1/admin/messages/${validMessageId}/unarchive`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(targetMessage.isArchived).toBe(false);
    });
  });

  describe('DELETE /api/v1/admin/messages/:id', () => {
    it('should delete message', async () => {
      jest.spyOn(Message, 'findById').mockResolvedValue(mockMessage as any);
      jest.spyOn(Message, 'findByIdAndDelete').mockResolvedValue(mockMessage as any);

      const res = await request(app)
        .delete(`/api/v1/admin/messages/${validMessageId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Message.findByIdAndDelete).toHaveBeenCalledWith(validMessageId);
    });

    it('should return 404 when deleting non-existent message', async () => {
      jest.spyOn(Message, 'findById').mockResolvedValue(null as any);

      const res = await request(app)
        .delete(`/api/v1/admin/messages/${validMessageId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
