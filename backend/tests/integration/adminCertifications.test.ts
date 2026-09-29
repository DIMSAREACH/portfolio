import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import app from '../../src/app';
import Certification from '../../src/models/Certification';
import cloudinaryService from '../../src/services/cloudinary.service';
import { generateAccessToken } from '../../src/utils/jwt';

describe('Admin Certifications API Integration Tests (/api/v1/admin/certifications)', () => {
  const dummyAdminToken = generateAccessToken('admin-id-12345', 'admin');
  const validCertId = new mongoose.Types.ObjectId().toString();

  const mockCert: any = {
    _id: validCertId,
    name: { en: 'CKA: Certified Kubernetes Administrator', kh: 'វិញ្ញាបនបត្រ CKA' },
    type: 'certification',
    organization: { en: 'CNCF', kh: 'CNCF' },
    issueDate: new Date('2023-05-15'),
    image: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/certifications/cka.webp',
    isVisible: true,
    order: 1,
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCert.save.mockResolvedValue(mockCert);
    jest.spyOn(Certification.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/v1/admin/certifications', () => {
    it('should return 200 and certifications array for admin', async () => {
      const sortMock = {
        sort: jest.fn().mockImplementation(() => Promise.resolve([mockCert])),
      };
      jest.spyOn(Certification, 'find').mockReturnValue(sortMock as any);

      const res = await request(app)
        .get('/api/v1/admin/certifications')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].name.en).toBe('CKA: Certified Kubernetes Administrator');
    });

    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/v1/admin/certifications');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/admin/certifications/:id', () => {
    it('should return 200 and certification for valid ID', async () => {
      jest.spyOn(Certification, 'findById').mockResolvedValue(mockCert as any);

      const res = await request(app)
        .get(`/api/v1/admin/certifications/${validCertId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(validCertId);
    });

    it('should return 400 for invalid mongo ID format', async () => {
      const res = await request(app)
        .get('/api/v1/admin/certifications/invalid-mongo-id')
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });

    it('should return 404 when certification is not found', async () => {
      jest.spyOn(Certification, 'findById').mockResolvedValue(null);

      const res = await request(app)
        .get(`/api/v1/admin/certifications/${validCertId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/admin/certifications', () => {
    it('should return 201 on successful certification creation with image upload', async () => {
      jest.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue({
        publicId: 'uploaded_cert',
        url: 'http://res.cloudinary.com/cert.jpg',
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/portfolio/certifications/uploaded_cert.webp',
        width: 800,
        height: 600,
        format: 'webp',
        resourceType: 'image',
        bytes: 12345,
      });

      const res = await request(app)
        .post('/api/v1/admin/certifications')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .field('name[en]', 'Google Cloud Associate Cloud Engineer')
        .field('type', 'certification')
        .field('organization[en]', 'Google Cloud')
        .field('issueDate', '2023-08-01')
        .attach('image', Buffer.from('cert-badge-bytes'), 'badge.png');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.type).toBe('certification');
      expect(res.body.message).toBe('Certification created successfully');
    });

    it('should return 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/admin/certifications')
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          name: {},
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });
  });

  describe('PATCH /api/v1/admin/certifications/:id', () => {
    it('should return 200 on successful certification update', async () => {
      const instance: any = {
        ...mockCert,
        name: { en: 'Updated CKA', kh: '...' },
        save: jest.fn().mockImplementation(() => Promise.resolve(instance)),
      };
      jest.spyOn(Certification, 'findById').mockResolvedValue(instance as any);

      const res = await request(app)
        .patch(`/api/v1/admin/certifications/${validCertId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          name: { en: 'Updated CKA' },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Certification updated successfully');
    });

    it('should return 404 when certification to update is not found', async () => {
      jest.spyOn(Certification, 'findById').mockResolvedValue(null);

      const res = await request(app)
        .patch(`/api/v1/admin/certifications/${validCertId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`)
        .send({
          name: { en: 'Updated CKA' },
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/admin/certifications/:id', () => {
    it('should return 200 when certification is deleted successfully', async () => {
      const instance: any = {
        ...mockCert,
        image: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/certifications/cka.webp',
      };
      jest.spyOn(Certification, 'findById').mockResolvedValue(instance as any);
      jest.spyOn(cloudinaryService, 'deleteFile').mockResolvedValue({ result: 'ok' });
      jest.spyOn(Certification, 'findByIdAndDelete').mockResolvedValue(instance as any);

      const res = await request(app)
        .delete(`/api/v1/admin/certifications/${validCertId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Certification deleted successfully');
    });

    it('should return 404 when certification to delete is not found', async () => {
      jest.spyOn(Certification, 'findById').mockResolvedValue(null);

      const res = await request(app)
        .delete(`/api/v1/admin/certifications/${validCertId}`)
        .set('Authorization', `Bearer ${dummyAdminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
