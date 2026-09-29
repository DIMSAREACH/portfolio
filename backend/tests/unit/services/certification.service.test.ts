import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import Certification from '../../../src/models/Certification';
import cloudinaryService from '../../../src/services/cloudinary.service';
import certificationService, { extractPublicId } from '../../../src/services/certification.service';
import { NotFoundError } from '../../../src/utils/AppError';

describe('CertificationService', () => {
  const dummyCertId = new mongoose.Types.ObjectId().toString();

  const mockCertInstance: any = {
    _id: dummyCertId,
    name: { en: 'AWS Certified Solutions Architect', kh: 'វិញ្ញាបនបត្រស្ថាបត្យករដំណោះស្រាយ AWS' },
    type: 'certification',
    organization: { en: 'Amazon Web Services', kh: 'ក្រុមហ៊ុន Amazon' },
    issueDate: new Date('2023-01-01'),
    expirationDate: new Date('2026-01-01'),
    credentialId: 'AWS-123456',
    credentialUrl: 'https://aws.amazon.com/verify/123456',
    image: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/certifications/aws_cert.webp',
    description: { en: 'Associate level certification', kh: 'កម្រិត Associate' },
    isVisible: true,
    order: 1,
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCertInstance.save.mockResolvedValue(mockCertInstance);

    jest.spyOn(Certification.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('extractPublicId', () => {
    it('should parse public ID from standard Cloudinary URL', () => {
      const url = 'https://res.cloudinary.com/demo/image/upload/v123456789/portfolio/certifications/cert_badge.webp';
      expect(extractPublicId(url)).toBe('portfolio/certifications/cert_badge');
    });

    it('should return null for invalid URLs', () => {
      expect(extractPublicId('https://example.com/badge.png')).toBeNull();
      expect(extractPublicId('')).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should return all certifications sorted by type and order when no pagination is requested', async () => {
      const mockSort = {
        sort: jest.fn().mockImplementation(() => Promise.resolve([mockCertInstance])),
      };
      jest.spyOn(Certification, 'find').mockReturnValue(mockSort as any);

      const result = await certificationService.getAll({
        type: 'certification',
        isVisible: 'true',
        search: 'Solutions',
      });

      expect(Certification.find).toHaveBeenCalled();
      expect(mockSort.sort).toHaveBeenCalledWith({ type: 1, order: 1, createdAt: -1 });
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });

    it('should return paginated certifications when page or limit is provided', async () => {
      const mockQueryChain: any = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: (jest.fn() as any).mockResolvedValue([mockCertInstance]),
      };

      jest.spyOn(Certification, 'find').mockReturnValue(mockQueryChain as any);
      jest.spyOn(Certification, 'countDocuments').mockResolvedValue(1 as any);

      const result = await certificationService.getAll({ page: 1, limit: 10 });

      expect(Certification.find).toHaveBeenCalled();
      expect(Certification.countDocuments).toHaveBeenCalled();
      expect('pagination' in result).toBe(true);
      if ('pagination' in result) {
        expect(result.items).toHaveLength(1);
        expect(result.pagination.total).toBe(1);
      }
    });
  });

  describe('getById', () => {
    it('should return certification when found', async () => {
      jest.spyOn(Certification, 'findById').mockResolvedValue(mockCertInstance as any);

      const result = await certificationService.getById(dummyCertId);

      expect(Certification.findById).toHaveBeenCalledWith(dummyCertId);
      expect(result).toEqual(mockCertInstance);
    });

    it('should throw NotFoundError if certification does not exist', async () => {
      jest.spyOn(Certification, 'findById').mockResolvedValue(null);

      await expect(certificationService.getById(dummyCertId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    it('should create certification with optional file upload', async () => {
      const uploadSpy = jest.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue({
        publicId: 'uploaded_cert',
        url: 'http://res.cloudinary.com/cert.jpg',
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/certifications/uploaded_cert.webp',
        width: 800,
        height: 600,
        format: 'webp',
        resourceType: 'image',
        bytes: 12345,
      });

      const mockFile = { buffer: Buffer.from('test') } as Express.Multer.File;

      const result = await certificationService.create(
        {
          name: { en: 'CKA: Certified Kubernetes Administrator' },
          type: 'certification',
          organization: { en: 'Linux Foundation' },
          issueDate: '2023-06-01',
        },
        mockFile,
      );

      expect(uploadSpy).toHaveBeenCalledWith(mockFile.buffer, 'portfolio/certifications');
      expect(result).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update fields and replace image when new file is uploaded', async () => {
      const instance: any = {
        ...mockCertInstance,
        image: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/certifications/old_badge.webp',
        save: jest.fn().mockImplementation(() => Promise.resolve(instance)),
      };
      jest.spyOn(Certification, 'findById').mockResolvedValue(instance as any);
      jest.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue({
        publicId: 'new_badge',
        url: 'http://res.cloudinary.com/new.jpg',
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/certifications/new_badge.webp',
        width: 800,
        height: 600,
        format: 'webp',
        resourceType: 'image',
        bytes: 12345,
      });
      const deleteSpy = jest.spyOn(cloudinaryService, 'deleteFile').mockResolvedValue({ result: 'ok' });

      const mockFile = { buffer: Buffer.from('new-badge') } as Express.Multer.File;

      const updated = await certificationService.update(
        dummyCertId,
        {
          name: { en: 'AWS Certified Solutions Architect - Professional' },
          order: 2,
        },
        mockFile,
      );

      expect(deleteSpy).toHaveBeenCalledWith('portfolio/certifications/old_badge');
      expect(instance.name.en).toBe('AWS Certified Solutions Architect - Professional');
      expect(instance.order).toBe(2);
      expect(instance.save).toHaveBeenCalled();
      expect(updated).toBeDefined();
    });

    it('should throw NotFoundError if certification to update does not exist', async () => {
      jest.spyOn(Certification, 'findById').mockResolvedValue(null);

      await expect(
        certificationService.update(dummyCertId, { type: 'award' }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete certification and clean up its Cloudinary image', async () => {
      const instance: any = {
        ...mockCertInstance,
        image: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/certifications/badge.webp',
      };
      jest.spyOn(Certification, 'findById').mockResolvedValue(instance as any);
      const deleteFileSpy = jest.spyOn(cloudinaryService, 'deleteFile').mockResolvedValue({ result: 'ok' });
      const deleteCertSpy = jest.spyOn(Certification, 'findByIdAndDelete').mockResolvedValue(instance as any);

      await certificationService.delete(dummyCertId);

      expect(deleteFileSpy).toHaveBeenCalledWith('portfolio/certifications/badge');
      expect(deleteCertSpy).toHaveBeenCalledWith(dummyCertId);
    });

    it('should throw NotFoundError if certification to delete does not exist', async () => {
      jest.spyOn(Certification, 'findById').mockResolvedValue(null);

      await expect(certificationService.delete(dummyCertId)).rejects.toThrow(NotFoundError);
    });
  });
});
