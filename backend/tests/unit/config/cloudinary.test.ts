import { describe, it, expect } from '@jest/globals';
import cloudinary from '../../../src/config/cloudinary';
import config from '../../../src/config/environment';

describe('Cloudinary Configuration', () => {
  it('should configure Cloudinary with environment variables', () => {
    const cloudinaryConfig = cloudinary.config();

    expect(cloudinaryConfig.cloud_name).toBe(config.CLOUDINARY_CLOUD_NAME);
    expect(cloudinaryConfig.api_key).toBe(config.CLOUDINARY_API_KEY);
    expect(cloudinaryConfig.api_secret).toBe(config.CLOUDINARY_API_SECRET);
    expect(cloudinaryConfig.secure).toBe(true);
  });
});
