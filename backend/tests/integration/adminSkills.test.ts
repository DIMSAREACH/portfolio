import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import app from '../../src/app';
import Skill from '../../src/models/Skill';
import { generateAccessToken } from '../../src/utils/jwt';

describe('Admin Skills API Integration Tests (/api/v1/admin/skills)', () => {
  const dummyAdminToken = generateAccessToken('admin-id-12345', 'admin');
  const validSkillId = new mongoose.Types.ObjectId().toString();

  const mockSkill: any = {
    _id: validSkillId,
    name: 'NestJS',
    category: { en: 'Backend', kh: 'ផ្នែកខាងក្រោយ' },
    icon: 'nestjs-icon',
    order: 1,
    isVisible: true,
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSkill.save.mockResolvedValue(mockSkill);
    jest.spyOn(Skill.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/v1/admin/skills', () => {
    it('should return 200 and skills array for admin', async () => {
      const sortMock = {
        sort: jest.fn().mockImplementation(() => Promise.resolve([mockSkill])),
      };
      jest.spyOn(Skill, 'find').mockReturnValue(sortMock as any);

      const res = await request(app)
        .get('/api/v1/admin/skills')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].name).toBe('NestJS');
    });

    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/v1/admin/skills');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/admin/skills/:id', () => {
    it('should return 200 and skill for valid ID', async () => {
      jest.spyOn(Skill, 'findById').mockResolvedValue(mockSkill as any);

      const res = await request(app)
        .get(`/api/v1/admin/skills/${validSkillId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(validSkillId);
    });

    it('should return 400 for invalid mongo ID format', async () => {
      const res = await request(app)
        .get('/api/v1/admin/skills/invalid-mongo-id')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });

    it('should return 404 when skill is not found', async () => {
      jest.spyOn(Skill, 'findById').mockResolvedValue(null);

      const res = await request(app)
        .get(`/api/v1/admin/skills/${validSkillId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/admin/skills', () => {
    it('should return 201 on successful skill creation', async () => {
      const res = await request(app)
        .post('/api/v1/admin/skills')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          name: 'Docker',
          category: { en: 'DevOps', kh: 'ដេវអបស៍' },
          icon: 'docker-icon',
          order: 3,
          isVisible: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Docker');
      expect(res.body.message).toBe('Skill created successfully');
    });

    it('should return 400 when skill name or category is missing', async () => {
      const res = await request(app)
        .post('/api/v1/admin/skills')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          icon: 'docker-icon',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });
  });

  describe('PATCH /api/v1/admin/skills/:id', () => {
    it('should return 200 on successful skill update', async () => {
      const instance: any = {
        ...mockSkill,
        name: 'Updated NestJS',
        save: jest.fn().mockImplementation(() => Promise.resolve(instance)),
      };
      jest.spyOn(Skill, 'findById').mockResolvedValue(instance as any);

      const res = await request(app)
        .patch(`/api/v1/admin/skills/${validSkillId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          name: 'Updated NestJS',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Skill updated successfully');
    });

    it('should return 404 when skill to update is not found', async () => {
      jest.spyOn(Skill, 'findById').mockResolvedValue(null);

      const res = await request(app)
        .patch(`/api/v1/admin/skills/${validSkillId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          name: 'Updated NestJS',
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/admin/skills/:id', () => {
    it('should return 200 when skill is deleted successfully', async () => {
      jest.spyOn(Skill, 'findById').mockResolvedValue(mockSkill as any);
      jest.spyOn(Skill, 'findByIdAndDelete').mockResolvedValue(mockSkill as any);

      const res = await request(app)
        .delete(`/api/v1/admin/skills/${validSkillId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Skill deleted successfully');
    });

    it('should return 404 when skill to delete is not found', async () => {
      jest.spyOn(Skill, 'findById').mockResolvedValue(null);

      const res = await request(app)
        .delete(`/api/v1/admin/skills/${validSkillId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
