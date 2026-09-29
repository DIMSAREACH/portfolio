import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import Settings from '../../../src/models/Settings';
import settingsService, { DEFAULT_SETTINGS } from '../../../src/services/settings.service';

describe('SettingsService', () => {
  const mockSettingsInstance: any = {
    _id: '6abc2f77ed5966aa1b87e233',
    siteTitle: { en: 'My Portfolio', kh: 'ស្នាដៃខ្ញុំ' },
    siteDescription: { en: 'Software Developer', kh: 'អ្នកអភិវឌ្ឍន៍' },
    enableCvDownload: true,
    cvDownloadCount: 5,
    enableContactForm: true,
    emailNotifications: true,
    notificationEmail: 'admin@example.com',
    maintenanceMode: false,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSettingsInstance.save.mockResolvedValue(mockSettingsInstance);

    jest.spyOn(Settings.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getSettings', () => {
    it('should return existing settings when found', async () => {
      jest.spyOn(Settings, 'findOne').mockResolvedValue(mockSettingsInstance as any);

      const result = await settingsService.getSettings();

      expect(Settings.findOne).toHaveBeenCalled();
      expect(result.siteTitle.en).toBe('My Portfolio');
      expect(result.notificationEmail).toBe('admin@example.com');
    });

    it('should create and return default settings when not found', async () => {
      jest.spyOn(Settings, 'findOne').mockResolvedValue(null as any);

      const result = await settingsService.getSettings();

      expect(Settings.findOne).toHaveBeenCalled();
      expect(result.siteTitle.en).toBe(DEFAULT_SETTINGS.siteTitle.en);
      expect(result.enableCvDownload).toBe(true);
    });
  });

  describe('updateSettings', () => {
    it('should update existing settings when found', async () => {
      const existing = {
        ...mockSettingsInstance,
        save: jest.fn().mockImplementation(function (this: any) {
          return Promise.resolve(this);
        }),
      };
      jest.spyOn(Settings, 'findOne').mockResolvedValue(existing as any);

      const updateData = {
        siteTitle: { en: 'Updated Title', kh: 'ចំណងជើងកែប្រែ' },
        maintenanceMode: true,
        notificationEmail: 'notify@example.com',
      };

      const result = await settingsService.updateSettings(updateData);

      expect(existing.save).toHaveBeenCalled();
      expect(result.siteTitle.en).toBe('Updated Title');
      expect(result.maintenanceMode).toBe(true);
      expect(result.notificationEmail).toBe('notify@example.com');
    });

    it('should create new settings with defaults if none exists', async () => {
      jest.spyOn(Settings, 'findOne').mockResolvedValue(null as any);

      const updateData = {
        siteTitle: { en: 'Brand New Site', kh: 'គេហទំព័រថ្មី' },
        enableCvDownload: false,
      };

      const result = await settingsService.updateSettings(updateData);

      expect(result.siteTitle.en).toBe('Brand New Site');
      expect(result.enableCvDownload).toBe(false);
    });
  });

  describe('downloadCv', () => {
    it('should return CV url and increment download count when CV is available and downloads are enabled', async () => {
      const settingsWithCv: any = {
        _id: '6abc2f77ed5966aa1b87e233',
        enableCvDownload: true,
        cvFile: {
          url: 'https://res.cloudinary.com/demo/image/upload/v12345/portfolio/cv/my_cv.pdf',
          fileName: 'my_cv.pdf',
          publicId: 'portfolio/cv/my_cv',
        },
      };

      jest.spyOn(Settings, 'findOne').mockResolvedValue(settingsWithCv as any);
      jest.spyOn(Settings, 'updateOne').mockResolvedValue({ modifiedCount: 1 } as any);

      const url = await settingsService.downloadCv();

      expect(url).toBe(settingsWithCv.cvFile.url);
      expect(Settings.updateOne).toHaveBeenCalledWith(
        { _id: settingsWithCv._id },
        { $inc: { cvDownloadCount: 1 } },
      );
    });

    it('should throw NotFoundError if settings do not exist', async () => {
      jest.spyOn(Settings, 'findOne').mockResolvedValue(null as any);

      await expect(settingsService.downloadCv()).rejects.toThrow('CV file is not available for download');
    });

    it('should throw NotFoundError if enableCvDownload is false', async () => {
      const settingsDisabled: any = {
        _id: '6abc2f77ed5966aa1b87e233',
        enableCvDownload: false,
        cvFile: {
          url: 'https://res.cloudinary.com/demo/cv.pdf',
        },
      };

      jest.spyOn(Settings, 'findOne').mockResolvedValue(settingsDisabled as any);

      await expect(settingsService.downloadCv()).rejects.toThrow('CV file is not available for download');
    });

    it('should throw NotFoundError if cvFile is missing or has no url', async () => {
      const settingsNoCv: any = {
        _id: '6abc2f77ed5966aa1b87e233',
        enableCvDownload: true,
        cvFile: undefined,
      };

      jest.spyOn(Settings, 'findOne').mockResolvedValue(settingsNoCv as any);

      await expect(settingsService.downloadCv()).rejects.toThrow('CV file is not available for download');
    });
  });
});
