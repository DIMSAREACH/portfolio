import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import app from '../../src/app';
import Media from '../../src/models/Media';
import Settings from '../../src/models/Settings';
import cloudinaryService from '../../src/services/cloudinary.service';
import { generateAccessToken } from '../../src/utils/jwt';

describe('Admin Media and CV API Integration Tests', () => {
  const dummyAdminToken = generateAccessToken('admin-user-id', 'admin');
  const dummyUserToken = generateAccessToken('normal-user-id', 'user');
  const validMediaId = new mongoose.Types.ObjectId().toString();

  const mockMedia: any = {
    _id: validMediaId,
    fileName: 'photo.jpg',
    url: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/media/photo.webp',
    publicId: 'portfolio/media/photo',
    mimeType: 'image/jpeg',
    size: 15000,
    width: 600,
    height: 400,
    folder: 'portfolio/media',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    save: jest.fn(),
  };

  const mockSettings: any = {
    _id: '6abc2f77ed5966aa1b87e233',
    cvFile: {
      url: 'https://res.cloudinary.com/demo/raw/upload/v12345/portfolio/cv/resume.pdf',
      publicId: 'portfolio/cv/resume',
      fileName: 'resume.pdf',
    },
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockMedia.save.mockResolvedValue(mockMedia);
    mockSettings.save.mockResolvedValue(mockSettings);

    jest.spyOn(Media.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
    jest.spyOn(Settings.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Media Endpoints (/api/v1/admin/media)', () => {
    describe('GET /api/v1/admin/media', () => {
      it('should return 200 and paginated media files for admin', async () => {
        const mockQueryChain = {
          sort: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockImplementation(() => Promise.resolve([mockMedia])),
        };
        jest.spyOn(Media, 'find').mockReturnValue(mockQueryChain as any);
        jest.spyOn(Media, 'countDocuments').mockResolvedValue(1 as any);

        const res = await request(app)
          .get('/api/v1/admin/media')
          .set('Authorization', `Bearer ${dummyAdminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.items).toHaveLength(1);
        expect(res.body.data.pagination).toBeDefined();
      });

      it('should reject unauthenticated request with 401', async () => {
        const res = await request(app).get('/api/v1/admin/media');

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });

      it('should reject non-admin request with 403', async () => {
        const res = await request(app)
          .get('/api/v1/admin/media')
          .set('Authorization', `Bearer ${dummyUserToken}`);

        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
      });
    });

    describe('POST /api/v1/admin/media/upload', () => {
      it('should upload media image and return 201', async () => {
        jest.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue({
          url: 'http://res.cloudinary.com/demo/image/upload/v12345/portfolio/media/photo.webp',
          secureUrl: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/media/photo.webp',
          publicId: 'portfolio/media/photo',
          width: 600,
          height: 400,
          format: 'webp',
          bytes: 15000,
          resourceType: 'image',
        });

        const fakeImage = Buffer.from('fake-image-bytes');

        const res = await request(app)
          .post('/api/v1/admin/media/upload')
          .set('Authorization', `Bearer ${dummyAdminToken}`)
          .attach('file', fakeImage, 'photo.png');

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.fileName).toBe('photo.png');
      });
    });

    describe('DELETE /api/v1/admin/media/:id', () => {
      it('should delete media and return 200', async () => {
        jest.spyOn(Media, 'findById').mockResolvedValue(mockMedia as any);
        jest.spyOn(cloudinaryService, 'deleteFile').mockResolvedValue({ result: 'ok' });
        jest.spyOn(Media, 'findByIdAndDelete').mockResolvedValue(mockMedia as any);

        const res = await request(app)
          .delete(`/api/v1/admin/media/${validMediaId}`)
          .set('Authorization', `Bearer ${dummyAdminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Media.findByIdAndDelete).toHaveBeenCalledWith(validMediaId);
      });

      it('should return 404 when media not found', async () => {
        jest.spyOn(Media, 'findById').mockResolvedValue(null as any);

        const res = await request(app)
          .delete(`/api/v1/admin/media/${validMediaId}`)
          .set('Authorization', `Bearer ${dummyAdminToken}`);

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
      });
    });
  });

  describe('CV Endpoints (/api/v1/admin/cv)', () => {
    describe('GET /api/v1/admin/cv', () => {
      it('should return 200 and CV file info for admin', async () => {
        jest.spyOn(Settings, 'findOne').mockResolvedValue(mockSettings as any);

        const res = await request(app)
          .get('/api/v1/admin/cv')
          .set('Authorization', `Bearer ${dummyAdminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.fileName).toBe('resume.pdf');
      });
    });

    describe('POST /api/v1/admin/cv/upload', () => {
      it('should upload PDF CV file and return 201', async () => {
        jest.spyOn(Settings, 'findOne').mockResolvedValue(mockSettings as any);
        jest.spyOn(cloudinaryService, 'deleteFile').mockResolvedValue({ result: 'ok' });
        jest.spyOn(cloudinaryService, 'uploadPdf').mockResolvedValue({
          url: 'http://res.cloudinary.com/demo/raw/upload/v9999/portfolio/cv/my_resume.pdf',
          secureUrl: 'https://res.cloudinary.com/demo/raw/upload/v9999/portfolio/cv/my_resume.pdf',
          publicId: 'portfolio/cv/my_resume',
          bytes: 45000,
          format: 'pdf',
          resourceType: 'raw',
        });

        const fakePdf = Buffer.from('%PDF-1.4 fake pdf content');

        const res = await request(app)
          .post('/api/v1/admin/cv/upload')
          .set('Authorization', `Bearer ${dummyAdminToken}`)
          .attach('file', fakePdf, 'my_resume.pdf');

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.fileName).toBe('my_resume.pdf');
      });
    });

    describe('DELETE /api/v1/admin/cv', () => {
      it('should delete active CV and return 200', async () => {
        const targetSettings = {
          ...mockSettings,
          save: jest.fn().mockImplementation(function (this: any) {
            return Promise.resolve(this);
          }),
        };
        jest.spyOn(Settings, 'findOne').mockResolvedValue(targetSettings as any);
        jest.spyOn(cloudinaryService, 'deleteFile').mockResolvedValue({ result: 'ok' });

        const res = await request(app)
          .delete('/api/v1/admin/cv')
          .set('Authorization', `Bearer ${dummyAdminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(targetSettings.cvFile).toBeUndefined();
      });

      it('should return 404 when no CV exists to delete', async () => {
        jest.spyOn(Settings, 'findOne').mockResolvedValue({ cvFile: undefined } as any);

        const res = await request(app)
          .delete('/api/v1/admin/cv')
          .set('Authorization', `Bearer ${dummyAdminToken}`);

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
      });
    });
  });
});
