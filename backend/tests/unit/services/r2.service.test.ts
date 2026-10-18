import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { R2Service } from '../../../src/services/r2.service';
import * as r2Config from '../../../src/config/r2';

describe('R2Service', () => {
  let service: R2Service;
  const mockSend = jest.fn<(...args: any[]) => Promise<any>>();

  beforeEach(() => {
    jest.clearAllMocks();
    service = new R2Service();
    jest.spyOn(r2Config, 'getR2Client').mockReturnValue({
      send: mockSend as any,
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('isAvailable', () => {
    it('should reflect isR2Configured status', () => {
      jest.spyOn(r2Config, 'isR2Configured').mockReturnValue(true);
      expect(service.isAvailable()).toBe(true);

      jest.spyOn(r2Config, 'isR2Configured').mockReturnValue(false);
      expect(service.isAvailable()).toBe(false);
    });
  });

  describe('uploadBuffer', () => {
    it('should send PutObjectCommand and return public url and publicId', async () => {
      mockSend.mockResolvedValueOnce({} as any);

      const buffer = Buffer.from('hello-r2');
      const result = await service.uploadBuffer(
        buffer,
        'portfolio/images',
        'sample.png',
        'image/png',
        'image',
      );

      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(result.url).toContain('.r2.dev/portfolio/images/');
      expect(result.publicId).toContain('portfolio/images/');
      expect(result.resourceType).toBe('image');
      expect(result.format).toBe('png');
      expect(result.bytes).toBe(buffer.length);
    });
  });

  describe('deleteFile', () => {
    it('should send DeleteObjectCommand and return ok result', async () => {
      mockSend.mockResolvedValueOnce({} as any);

      const result = await service.deleteFile('portfolio/images/test.png');

      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ result: 'ok' });
    });
  });

  describe('extractKeyFromUrl', () => {
    it('should extract key from r2.dev public domain URL', () => {
      const url = 'https://pub-302362a110914f64a942be360aa58fa3.r2.dev/portfolio/media/pic.jpg';
      const key = service.extractKeyFromUrl(url);
      expect(key).toBe('portfolio/media/pic.jpg');
    });

    it('should return null for empty url', () => {
      expect(service.extractKeyFromUrl('')).toBeNull();
    });
  });
});
