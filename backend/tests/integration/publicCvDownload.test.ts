import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import app from '../../src/app';
import settingsService from '../../src/services/settings.service';
import { NotFoundError } from '../../src/utils/AppError';

describe('Public CV Download API Integration Tests (GET /api/v1/cv/download)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should redirect (302) to CV file URL when CV is available and enabled', async () => {
    const mockCvUrl = 'https://res.cloudinary.com/demo/raw/upload/v12345/portfolio/cv/resume.pdf';
    jest.spyOn(settingsService, 'downloadCv').mockResolvedValue(mockCvUrl);

    const res = await request(app).get('/api/v1/cv/download');

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe(mockCvUrl);
    expect(settingsService.downloadCv).toHaveBeenCalled();
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
