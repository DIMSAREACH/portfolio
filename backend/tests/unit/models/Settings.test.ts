import { describe, it, expect } from '@jest/globals';
import Settings from '../../../src/models/Settings';

describe('Settings Model', () => {
  const validSettingsData = {
    siteTitle: {
      en: 'Developer Portfolio & CMS',
      kh: 'គេហទំព័រផលប័ត្រ និង CMS',
    },
    siteDescription: {
      en: 'Full-Stack Developer Portfolio showcasing projects and skills',
      kh: 'ផលប័ត្រអ្នកអភិវឌ្ឍន៍ Full-Stack បង្ហាញពីគម្រោង និងជំនាញ',
    },
  };

  it('should validate settings with required attributes and correct defaults', async () => {
    const settings = new Settings(validSettingsData);

    await expect(settings.validate()).resolves.toBeUndefined();
    expect(settings.siteTitle.en).toBe('Developer Portfolio & CMS');
    expect(settings.siteDescription.en).toContain('Full-Stack Developer');
    expect(settings.enableCvDownload).toBe(true);
    expect(settings.cvDownloadCount).toBe(0);
    expect(settings.enableContactForm).toBe(true);
    expect(settings.emailNotifications).toBe(true);
    expect(settings.maintenanceMode).toBe(false);
  });

  it('should reject when required fields are missing', async () => {
    const emptySettings = new Settings({});

    await expect(emptySettings.validate()).rejects.toThrow();
  });

  it('should reject when bilingual title is incomplete', async () => {
    const incompleteSettings = new Settings({
      ...validSettingsData,
      siteTitle: { en: 'Only English' },
    });

    await expect(incompleteSettings.validate()).rejects.toThrow(/Khmer text is required/);
  });

  it('should validate optional cvFile and notificationEmail correctly', async () => {
    const settings = new Settings({
      ...validSettingsData,
      cvFile: {
        url: 'https://res.cloudinary.com/demo/image/upload/cv.pdf',
        publicId: 'portfolio/cv_123456',
        fileName: 'Resume-2026.pdf',
      },
      cvDownloadCount: 42,
      notificationEmail: 'ADMIN@PORTFOLIO.DEV',
      maintenanceMode: true,
    });

    await expect(settings.validate()).resolves.toBeUndefined();
    expect(settings.cvFile?.fileName).toBe('Resume-2026.pdf');
    expect(settings.cvDownloadCount).toBe(42);
    expect(settings.notificationEmail).toBe('admin@portfolio.dev');
    expect(settings.maintenanceMode).toBe(true);
  });

  it('should reject invalid notificationEmail', async () => {
    const invalidEmailSettings = new Settings({
      ...validSettingsData,
      notificationEmail: 'invalid-email-string',
    });

    await expect(invalidEmailSettings.validate()).rejects.toThrow(
      /Please provide a valid notification email address/,
    );
  });
});
