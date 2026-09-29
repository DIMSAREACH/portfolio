import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { Writable } from 'stream';
import cloudinary from '../../../src/config/cloudinary';
import cloudinaryService from '../../../src/services/cloudinary.service';
import logger from '../../../src/utils/logger';

describe('CloudinaryService', () => {
  const dummyBuffer = Buffer.from('fake-file-content');
  const mockUploadResponse = {
    url: 'http://res.cloudinary.com/demo/image/upload/v1234/test.jpg',
    secure_url: 'https://res.cloudinary.com/demo/image/upload/v1234/test.jpg',
    public_id: 'portfolio/projects/test_123',
    width: 1920,
    height: 1080,
    format: 'jpg',
    bytes: 204800,
    resource_type: 'image',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(logger, 'error').mockImplementation(() => logger);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('uploadImage', () => {
    it('should upload image buffer with auto transformation and correct options', async () => {
      let capturedOptions: any;
      jest.spyOn(cloudinary.uploader, 'upload_stream').mockImplementation((options: any, callback?: any) => {
        capturedOptions = options;
        return new Writable({
          write(_chunk, _enc, next) {
            next();
          },
          final(cb) {
            if (callback) callback(null, mockUploadResponse);
            cb();
          },
        }) as any;
      });

      const result = await cloudinaryService.uploadImage(
        dummyBuffer,
        'portfolio/projects',
        'custom_id',
      );

      expect(capturedOptions).toEqual({
        folder: 'portfolio/projects',
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        public_id: 'custom_id',
      });

      expect(result).toEqual({
        url: mockUploadResponse.url,
        secureUrl: mockUploadResponse.secure_url,
        publicId: mockUploadResponse.public_id,
        width: 1920,
        height: 1080,
        format: 'jpg',
        bytes: 204800,
        resourceType: 'image',
      });
    });

    it('should handle optional publicId omitted', async () => {
      let capturedOptions: any;
      jest.spyOn(cloudinary.uploader, 'upload_stream').mockImplementation((options: any, callback?: any) => {
        capturedOptions = options;
        return new Writable({
          write(_chunk, _enc, next) {
            next();
          },
          final(cb) {
            if (callback) callback(null, mockUploadResponse);
            cb();
          },
        }) as any;
      });

      await cloudinaryService.uploadImage(dummyBuffer, 'portfolio/projects');

      expect(capturedOptions.public_id).toBeUndefined();
      expect(capturedOptions.folder).toBe('portfolio/projects');
    });

    it('should reject and log error when upload stream emits an error', async () => {
      const uploadError = new Error('Cloudinary connection timed out');
      jest.spyOn(cloudinary.uploader, 'upload_stream').mockImplementation((_options: any, callback?: any) => {
        return new Writable({
          write(_chunk, _enc, next) {
            next();
          },
          final(cb) {
            if (callback) callback(uploadError);
            cb();
          },
        }) as any;
      });

      await expect(
        cloudinaryService.uploadImage(dummyBuffer, 'portfolio/projects'),
      ).rejects.toThrow('Cloudinary connection timed out');

      expect(logger.error).toHaveBeenCalledWith(
        'Cloudinary upload stream error:',
        uploadError,
      );
    });
  });

  describe('uploadPdf', () => {
    it('should upload raw document (PDF) with resource_type raw', async () => {
      const mockPdfResponse = {
        ...mockUploadResponse,
        format: 'pdf',
        resource_type: 'raw',
      };

      let capturedOptions: any;
      jest.spyOn(cloudinary.uploader, 'upload_stream').mockImplementation((options: any, callback?: any) => {
        capturedOptions = options;
        return new Writable({
          write(_chunk, _enc, next) {
            next();
          },
          final(cb) {
            if (callback) callback(null, mockPdfResponse);
            cb();
          },
        }) as any;
      });

      const result = await cloudinaryService.uploadPdf(
        dummyBuffer,
        'portfolio/cv',
        'resume_v1',
      );

      expect(capturedOptions).toEqual({
        folder: 'portfolio/cv',
        resource_type: 'raw',
        public_id: 'resume_v1',
      });

      expect(result.format).toBe('pdf');
      expect(result.resourceType).toBe('raw');
    });
  });

  describe('deleteFile', () => {
    it('should destroy file using default resource_type image', async () => {
      const mockDestroyResponse = { result: 'ok' };
      const destroySpy = jest
        .spyOn(cloudinary.uploader, 'destroy')
        .mockResolvedValue(mockDestroyResponse as any);

      const result = await cloudinaryService.deleteFile('portfolio/projects/sample');

      expect(destroySpy).toHaveBeenCalledWith('portfolio/projects/sample', {
        resource_type: 'image',
      });
      expect(result).toEqual({ result: 'ok' });
    });

    it('should destroy file with custom resource_type raw', async () => {
      const mockDestroyResponse = { result: 'ok' };
      const destroySpy = jest
        .spyOn(cloudinary.uploader, 'destroy')
        .mockResolvedValue(mockDestroyResponse as any);

      const result = await cloudinaryService.deleteFile('portfolio/cv/my_cv', 'raw');

      expect(destroySpy).toHaveBeenCalledWith('portfolio/cv/my_cv', {
        resource_type: 'raw',
      });
      expect(result).toEqual({ result: 'ok' });
    });

    it('should log and rethrow error when deletion fails', async () => {
      const deleteError = new Error('Resource not found');
      jest.spyOn(cloudinary.uploader, 'destroy').mockRejectedValue(deleteError);

      await expect(
        cloudinaryService.deleteFile('portfolio/invalid_id'),
      ).rejects.toThrow('Resource not found');

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error deleting Cloudinary file'),
        deleteError,
      );
    });
  });
});
