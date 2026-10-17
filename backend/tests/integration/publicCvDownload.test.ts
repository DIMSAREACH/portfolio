import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import app from '../../src/app';
import settingsService from '../../src/services/settings.service';
import Settings from '../../src/models/Settings';
import { NotFoundError } from '../../src/utils/AppError';

describe('Public CV Download & Preview API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/v1/cv/download', () => {
    it('should redirect (302) to CV file URL when CV is a remote URL', async () => {
      const mockCvUrl = 'https://res.cloudinary.com/demo/raw/upload/v12345/portfolio/cv/resume.pdf';
      jest.spyOn(settingsService, 'downloadCv').mockResolvedValue(mockCvUrl);

      const res = await request(app).get('/api/v1/cv/download');

      expect(res.status).toBe(302);
      expect(res.headers.location).toBe(mockCvUrl);
      expect(settingsService.downloadCv).toHaveBeenCalled();
    });

    it('should stream decoded binary PDF when CV is a base64 data URL', async () => {
      const dummyBase64Pdf = 'data:application/pdf;base64,JVBERi0xLjQKJWR1bW15';
      jest.spyOn(settingsService, 'downloadCv').mockResolvedValue(dummyBase64Pdf);

      const res = await request(app).get('/api/v1/cv/download');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('application/pdf');
      expect(res.headers['content-disposition']).toContain('attachment; filename="Dim_Sareach_CV.pdf"');
    });

    it('should stream with inline disposition when query has inline=true', async () => {
      const dummyBase64Pdf = 'data:application/pdf;base64,JVBERi0xLjQKJWR1bW15';
      jest.spyOn(settingsService, 'downloadCv').mockResolvedValue(dummyBase64Pdf);

      const res = await request(app).get('/api/v1/cv/download?inline=true');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('application/pdf');
      expect(res.headers['content-disposition']).toContain('inline; filename="Dim_Sareach_CV.pdf"');
    });

    it('should return 404 when CV downloads are disabled or CV file is not found', async () => {
      jest
        .spyOn(settingsService, 'downloadCv')
        .mockRejectedValue(new NotFoundError('CV file is not available for download'));

      const res = await request(app).get('/api/v1/cv/download');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('CV file is not available for download');
    });
  });

  describe('GET /api/v1/cv/preview', () => {
    it('should stream decoded binary PDF inline when CV is base64 data URL', async () => {
      const dummyBase64Pdf = 'data:application/pdf;base64,JVBERi0xLjQKJWR1bW15';
      jest.spyOn(Settings, 'findOne').mockResolvedValue({
        cvFile: {
          url: dummyBase64Pdf,
          fileName: 'Test_CV.pdf',
        },
      } as any);

      const res = await request(app).get('/api/v1/cv/preview');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('application/pdf');
      expect(res.headers['content-disposition']).toContain('inline; filename="Test_CV.pdf"');
    });

    it('should redirect (302) to remote URL when CV is remote URL', async () => {
      const mockCvUrl = 'https://res.cloudinary.com/demo/raw/upload/v12345/portfolio/cv/resume.pdf';
      jest.spyOn(Settings, 'findOne').mockResolvedValue({
        cvFile: {
          url: mockCvUrl,
          fileName: 'resume.pdf',
        },
      } as any);

      const res = await request(app).get('/api/v1/cv/preview');

      expect(res.status).toBe(302);
      expect(res.headers.location).toBe(mockCvUrl);
    });

    it('should return 404 when no CV file exists in settings', async () => {
      jest.spyOn(Settings, 'findOne').mockResolvedValue(null);

      const res = await request(app).get('/api/v1/cv/preview');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('CV file is not available for preview');
    });
  });
});

