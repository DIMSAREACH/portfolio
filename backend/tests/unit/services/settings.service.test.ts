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
});
