import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import Media from '../../../src/models/Media';
import Settings from '../../../src/models/Settings';
import cloudinaryService from '../../../src/services/cloudinary.service';
import { mediaService, cvService } from '../../../src/services/media.service';
import { NotFoundError, ValidationError } from '../../../src/utils/AppError';

describe('MediaService and CvService', () => {
  const dummyMediaId = new mongoose.Types.ObjectId().toString();

  const mockMediaInstance: any = {
    _id: dummyMediaId,
    fileName: 'screenshot.png',
    url: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/media/screenshot.webp',
    publicId: 'portfolio/media/screenshot',
    mimeType: 'image/png',
    size: 20480,
    width: 800,
    height: 600,
    folder: 'portfolio/media',
    save: jest.fn(),
  };

  const mockSettingsInstance: any = {
    _id: '6abc2f77ed5966aa1b87e233',
    cvFile: {
      url: 'https://res.cloudinary.com/demo/raw/upload/v12345/portfolio/cv/my_cv.pdf',
      publicId: 'portfolio/cv/my_cv',
      fileName: 'my_cv.pdf',
    },
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockMediaInstance.save.mockResolvedValue(mockMediaInstance);
    mockSettingsInstance.save.mockResolvedValue(mockSettingsInstance);

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

  describe('MediaService.getAll', () => {
    it('should return paginated media list', async () => {
      const mockQueryChain = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockImplementation(() => Promise.resolve([mockMediaInstance])),
      };
      jest.spyOn(Media, 'find').mockReturnValue(mockQueryChain as any);
      jest.spyOn(Media, 'countDocuments').mockResolvedValue(1 as any);

      const result = await mediaService.getAll({ folder: 'portfolio/media', page: 1, limit: 10 });

      expect(Media.find).toHaveBeenCalledWith({
        folder: 'portfolio/media',
      });
      expect(result.items).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });
  });

  describe('MediaService.getById', () => {
    it('should return media when found', async () => {
      jest.spyOn(Media, 'findById').mockResolvedValue(mockMediaInstance as any);

      const result = await mediaService.getById(dummyMediaId);

      expect(Media.findById).toHaveBeenCalledWith(dummyMediaId);
      expect(result.fileName).toBe('screenshot.png');
    });

    it('should throw NotFoundError when media is not found', async () => {
      jest.spyOn(Media, 'findById').mockResolvedValue(null as any);

      await expect(mediaService.getById(dummyMediaId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('MediaService.upload', () => {
    it('should upload image buffer to Cloudinary and save new media document', async () => {
      jest.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue({
        url: 'http://res.cloudinary.com/demo/image/upload/v12345/portfolio/media/screenshot.webp',
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/media/screenshot.webp',
        publicId: 'portfolio/media/screenshot',
        width: 800,
        height: 600,
        bytes: 20480,
        format: 'webp',
        resourceType: 'image',
      });

      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: Buffer.from('fake-media'),
        size: 20480,
      } as any;

      const result = await mediaService.upload(mockFile);

      expect(cloudinaryService.uploadImage).toHaveBeenCalledWith(
        mockFile.buffer,
        'portfolio/media',
      );
      expect(result.url).toBe(
        'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/media/screenshot.webp',
      );
    });

    it('should throw ValidationError if no file is provided', async () => {
      await expect(mediaService.upload(undefined)).rejects.toThrow(ValidationError);
    });
  });

  describe('MediaService.delete', () => {
    it('should delete file from Cloudinary and remove document from DB', async () => {
      jest.spyOn(Media, 'findById').mockResolvedValue(mockMediaInstance as any);
      jest.spyOn(cloudinaryService, 'deleteFile').mockResolvedValue({ result: 'ok' });
      jest.spyOn(Media, 'findByIdAndDelete').mockResolvedValue(mockMediaInstance as any);

      await mediaService.delete(dummyMediaId);

      expect(cloudinaryService.deleteFile).toHaveBeenCalledWith('portfolio/media/screenshot');
      expect(Media.findByIdAndDelete).toHaveBeenCalledWith(dummyMediaId);
    });

    it('should throw NotFoundError if media to delete is not found', async () => {
      jest.spyOn(Media, 'findById').mockResolvedValue(null as any);

      await expect(mediaService.delete(dummyMediaId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('CvService.getCv', () => {
    it('should return current CV info when settings has cvFile', async () => {
      jest.spyOn(Settings, 'findOne').mockResolvedValue(mockSettingsInstance as any);

      const result = await cvService.getCv();

      expect(result?.fileName).toBe('my_cv.pdf');
    });

    it('should return null when no CV is registered', async () => {
      jest.spyOn(Settings, 'findOne').mockResolvedValue({ cvFile: undefined } as any);

      const result = await cvService.getCv();

      expect(result).toBeNull();
    });
  });

  describe('CvService.uploadCv', () => {
    it('should upload PDF to Cloudinary, delete old CV, and update settings', async () => {
      const existingSettings = {
        ...mockSettingsInstance,
        save: jest.fn().mockImplementation(function (this: any) {
          return Promise.resolve(this);
        }),
      };
      jest.spyOn(Settings, 'findOne').mockResolvedValue(existingSettings as any);
      jest.spyOn(cloudinaryService, 'deleteFile').mockResolvedValue({ result: 'ok' });
      jest.spyOn(cloudinaryService, 'uploadPdf').mockResolvedValue({
        url: 'http://res.cloudinary.com/demo/raw/upload/v9999/portfolio/cv/new_cv.pdf',
        secureUrl: 'https://res.cloudinary.com/demo/raw/upload/v9999/portfolio/cv/new_cv.pdf',
        publicId: 'portfolio/cv/new_cv',
        bytes: 50000,
        format: 'pdf',
        resourceType: 'raw',
      });

      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'new_cv.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        buffer: Buffer.from('fake-pdf'),
        size: 50000,
      } as any;

      const result = await cvService.uploadCv(mockFile);

      expect(cloudinaryService.deleteFile).toHaveBeenCalledWith('portfolio/cv/my_cv', 'raw');
      expect(cloudinaryService.uploadPdf).toHaveBeenCalledWith(mockFile.buffer, 'portfolio/cv');
      expect(existingSettings.save).toHaveBeenCalled();
      expect(result.fileName).toBe('new_cv.pdf');
    });

    it('should throw ValidationError if no file provided', async () => {
      await expect(cvService.uploadCv(undefined)).rejects.toThrow(ValidationError);
    });
  });

  describe('CvService.deleteCv', () => {
    it('should delete CV from Cloudinary and clear cvFile on settings', async () => {
      const existingSettings = {
        ...mockSettingsInstance,
        save: jest.fn().mockImplementation(function (this: any) {
          return Promise.resolve(this);
        }),
      };
      jest.spyOn(Settings, 'findOne').mockResolvedValue(existingSettings as any);
      jest.spyOn(cloudinaryService, 'deleteFile').mockResolvedValue({ result: 'ok' });

      await cvService.deleteCv();

      expect(cloudinaryService.deleteFile).toHaveBeenCalledWith('portfolio/cv/my_cv', 'raw');
      expect(existingSettings.cvFile).toBeUndefined();
      expect(existingSettings.save).toHaveBeenCalled();
    });

    it('should throw NotFoundError if no active CV exists to delete', async () => {
      jest.spyOn(Settings, 'findOne').mockResolvedValue({ cvFile: undefined } as any);

      await expect(cvService.deleteCv()).rejects.toThrow(NotFoundError);
    });
  });
});
