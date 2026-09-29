import { describe, it, expect } from '@jest/globals';
import Media from '../../../src/models/Media';

describe('Media Model', () => {
  const validMediaData = {
    fileName: 'hero-banner.jpg',
    url: 'https://res.cloudinary.com/demo/image/upload/v123456/portfolio/hero-banner.jpg',
    publicId: 'portfolio/hero-banner_123456',
    mimeType: 'image/jpeg',
    size: 204850,
  };

  it('should validate a media record with all required attributes', async () => {
    const media = new Media(validMediaData);

    await expect(media.validate()).resolves.toBeUndefined();
    expect(media.fileName).toBe('hero-banner.jpg');
    expect(media.url).toContain('hero-banner.jpg');
    expect(media.publicId).toBe('portfolio/hero-banner_123456');
    expect(media.mimeType).toBe('image/jpeg');
    expect(media.size).toBe(204850);
  });

  it('should reject when required fields are missing', async () => {
    const emptyMedia = new Media({});

    await expect(emptyMedia.validate()).rejects.toThrow();
  });

  it('should validate optional fields correctly', async () => {
    const media = new Media({
      ...validMediaData,
      width: 1920,
      height: 1080,
      altText: {
        en: 'Hero section background banner',
        kh: 'បដាផ្ទៃខាងក្រោយផ្នែកខាងលើ',
      },
      folder: 'portfolio/banners',
    });

    await expect(media.validate()).resolves.toBeUndefined();
    expect(media.width).toBe(1920);
    expect(media.height).toBe(1080);
    expect(media.altText?.en).toBe('Hero section background banner');
    expect(media.folder).toBe('portfolio/banners');
  });

  it('should define all 3 required indexes per PRD Section 11.13', () => {
    const indexes = Media.schema.indexes();

    const publicIdIndex = indexes.find((idx) => 'publicId' in idx[0]);
    expect(publicIdIndex).toBeDefined();
    expect(publicIdIndex?.[1]).toHaveProperty('unique', true);

    const mimeTypeIndex = indexes.find(
      (idx) => 'mimeType' in idx[0] && Object.keys(idx[0]).length === 1,
    );
    expect(mimeTypeIndex).toBeDefined();

    const createdAtIndex = indexes.find(
      (idx) => 'createdAt' in idx[0] && Object.keys(idx[0]).length === 1,
    );
    expect(createdAtIndex).toBeDefined();
    expect(createdAtIndex?.[0]).toEqual({ createdAt: -1 });
  });
});
