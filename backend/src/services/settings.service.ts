import Settings, { ISettings, ICvFile } from '../models/Settings';
import { BilingualField } from '../types';
import { NotFoundError } from '../utils/AppError';

export interface UpdateSettingsDto {
  siteTitle?: BilingualField;
  siteDescription?: BilingualField;
  enableCvDownload?: boolean;
  cvFile?: ICvFile;
  enableContactForm?: boolean;
  emailNotifications?: boolean;
  notificationEmail?: string;
  maintenanceMode?: boolean;
}

export const DEFAULT_SETTINGS = {
  siteTitle: {
    en: 'Developer Portfolio',
    kh: 'គេហទំព័រផ្ទាល់ខ្លួនរបស់អ្នកអភិវឌ្ឍន៍',
  },
  siteDescription: {
    en: 'Full stack developer portfolio and blog',
    kh: 'គេហទំព័របង្ហាញស្នាដៃ និងប្លុករបស់អ្នកអភិវឌ្ឍន៍',
  },
  enableCvDownload: true,
  enableContactForm: true,
  emailNotifications: true,
  maintenanceMode: false,
  cvDownloadCount: 0,
};

export class SettingsService {
  /**
   * Get current settings (creates and returns defaults if none exist)
   */
  async getSettings(): Promise<ISettings> {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(DEFAULT_SETTINGS);
      await settings.save();
    }
    return settings;
  }

  /**
   * Update or create (upsert) settings
   */
  async updateSettings(data: UpdateSettingsDto): Promise<ISettings> {
    let settings = await Settings.findOne();

    if (settings) {
      if (data.siteTitle) {
        settings.siteTitle = {
          en: data.siteTitle.en ?? settings.siteTitle.en,
          kh: data.siteTitle.kh ?? settings.siteTitle.kh,
        };
      }
      if (data.siteDescription) {
        settings.siteDescription = {
          en: data.siteDescription.en ?? settings.siteDescription.en,
          kh: data.siteDescription.kh ?? settings.siteDescription.kh,
        };
      }
      if (data.enableCvDownload !== undefined) {
        settings.enableCvDownload = data.enableCvDownload;
      }
      if (data.enableContactForm !== undefined) {
        settings.enableContactForm = data.enableContactForm;
      }
      if (data.emailNotifications !== undefined) {
        settings.emailNotifications = data.emailNotifications;
      }
      if (data.notificationEmail !== undefined) {
        settings.notificationEmail = data.notificationEmail;
      }
      if (data.maintenanceMode !== undefined) {
        settings.maintenanceMode = data.maintenanceMode;
      }
      if (data.cvFile !== undefined) {
        settings.cvFile = data.cvFile;
      }

      return await settings.save();
    }

    settings = new Settings({
      ...DEFAULT_SETTINGS,
      ...data,
    });
    return await settings.save();
  }

  /**
   * Get active CV URL for download and atomically increment cvDownloadCount
   */
  async downloadCv(): Promise<string> {
    const settings = await Settings.findOne();
    if (!settings || !settings.enableCvDownload || !settings.cvFile?.url) {
      throw new NotFoundError('CV file is not available for download');
    }

    await Settings.updateOne({ _id: settings._id }, { $inc: { cvDownloadCount: 1 } });
    return settings.cvFile.url;
  }
}

export const settingsService = new SettingsService();
export default settingsService;
