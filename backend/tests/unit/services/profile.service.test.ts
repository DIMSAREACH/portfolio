import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import Profile from '../../../src/models/Profile';
import cloudinaryService from '../../../src/services/cloudinary.service';
import profileService, { extractPublicId } from '../../../src/services/profile.service';

describe('ProfileService', () => {
  const mockProfileInstance: any = {
    _id: '6abc2f77ed5966aa1b87e233',
    fullName: { en: 'Dara Sok', kh: 'សុខ តារា' },
    title: { en: 'Senior Full Stack Developer', kh: 'អ្នកអភិវឌ្ឍន៍ជាន់ខ្ពស់' },
    introduction: { en: 'Building scalable web apps', kh: 'បង្កើតគេហទំព័រទំនើប' },
    about: { en: 'Software engineer with 5+ years experience', kh: 'វិស្វករផ្នែកទន់' },
    professionalSummary: { en: 'Summary', kh: 'សេចក្ដីសង្ខេប' },
    careerInterests: { en: 'Interests', kh: 'ចំណាប់អារម្មណ៍' },
    background: { en: 'Background', kh: 'ប្រវត្តិរូប' },
    strengths: { en: ['TypeScript', 'Node.js'], kh: ['TypeScript', 'Node.js'] },
    goals: { en: 'Goals', kh: 'គោលដៅ' },
    profileImage: 'https://res.cloudinary.com/demo/image/upload/v123456/portfolio/profile/old_avatar.webp',
    aboutImage: 'https://res.cloudinary.com/demo/image/upload/v123456/portfolio/profile/old_about.webp',
    email: 'dara@example.com',
    phone: '+85512345678',
    location: { en: 'Phnom Penh, Cambodia', kh: 'ភ្នំពេញ កម្ពុជា' },
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockProfileInstance.save.mockResolvedValue(mockProfileInstance);

    jest.spyOn(Profile.prototype, 'save').mockImplementation(function (this: any) {
      return Promise.resolve(this);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('extractPublicId', () => {
    it('should parse public ID from standard Cloudinary URL', () => {
      const url = 'https://res.cloudinary.com/demo/image/upload/v123456789/portfolio/profile/avatar.webp';
      expect(extractPublicId(url)).toBe('portfolio/profile/avatar');
    });

    it('should return null for non-cloudinary or empty URLs', () => {
      expect(extractPublicId('https://example.com/avatar.png')).toBeNull();
      expect(extractPublicId('')).toBeNull();
    });
  });

  describe('getProfile', () => {
    it('should return the profile document when found', async () => {
      jest.spyOn(Profile, 'findOne').mockResolvedValue(mockProfileInstance as any);

      const result = await profileService.getProfile();

      expect(Profile.findOne).toHaveBeenCalled();
      expect(result).toBe(mockProfileInstance);
    });

    it('should return null when no profile exists', async () => {
      jest.spyOn(Profile, 'findOne').mockResolvedValue(null as any);

      const result = await profileService.getProfile();

      expect(result).toBeNull();
    });
  });

  describe('upsertProfile', () => {
    it('should update existing profile when found', async () => {
      const existing = {
        ...mockProfileInstance,
        save: jest.fn().mockImplementation(function (this: any) {
          return Promise.resolve(this);
        }),
      };
      jest.spyOn(Profile, 'findOne').mockResolvedValue(existing as any);

      const updateData = {
        fullName: { en: 'Dara Sok Updated', kh: 'សុខ តារា កែប្រែ' },
        title: { en: 'Staff Software Engineer', kh: 'វិស្វករផ្នែកទន់ជាន់ខ្ពស់' },
        email: 'newemail@example.com',
      };

      const result = await profileService.upsertProfile(updateData);

      expect(existing.save).toHaveBeenCalled();
      expect(result.fullName.en).toBe('Dara Sok Updated');
      expect(result.title.en).toBe('Staff Software Engineer');
      expect(result.email).toBe('newemail@example.com');
    });

    it('should upload new profileImage and delete old Cloudinary image when updating', async () => {
      const existing = {
        ...mockProfileInstance,
        save: jest.fn().mockImplementation(function (this: any) {
          return Promise.resolve(this);
        }),
      };
      jest.spyOn(Profile, 'findOne').mockResolvedValue(existing as any);
      jest.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue({
        url: 'http://res.cloudinary.com/demo/image/upload/v99999/portfolio/profile/new_avatar.webp',
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/v99999/portfolio/profile/new_avatar.webp',
        publicId: 'portfolio/profile/new_avatar',
        width: 400,
        height: 400,
        format: 'webp',
        bytes: 12000,
        resourceType: 'image',
      });
      jest.spyOn(cloudinaryService, 'deleteFile').mockResolvedValue({ result: 'ok' });

      const mockFile: Express.Multer.File = {
        fieldname: 'profileImage',
        originalname: 'avatar.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: Buffer.from('fake-avatar'),
        size: 1024,
      } as any;

      const result = await profileService.upsertProfile({}, { profileImage: [mockFile] });

      expect(cloudinaryService.uploadImage).toHaveBeenCalledWith(
        mockFile.buffer,
        'portfolio/profile',
      );
      expect(cloudinaryService.deleteFile).toHaveBeenCalledWith('portfolio/profile/old_avatar');
      expect(result.profileImage).toBe(
        'https://res.cloudinary.com/demo/image/upload/v99999/portfolio/profile/new_avatar.webp',
      );
    });

    it('should upload new aboutImage and delete old Cloudinary image when updating', async () => {
      const existing = {
        ...mockProfileInstance,
        save: jest.fn().mockImplementation(function (this: any) {
          return Promise.resolve(this);
        }),
      };
      jest.spyOn(Profile, 'findOne').mockResolvedValue(existing as any);
      jest.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue({
        url: 'http://res.cloudinary.com/demo/image/upload/v88888/portfolio/profile/new_about.webp',
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/v88888/portfolio/profile/new_about.webp',
        publicId: 'portfolio/profile/new_about',
        width: 800,
        height: 600,
        format: 'webp',
        bytes: 25000,
        resourceType: 'image',
      });
      jest.spyOn(cloudinaryService, 'deleteFile').mockResolvedValue({ result: 'ok' });

      const mockFile: Express.Multer.File = {
        fieldname: 'aboutImage',
        originalname: 'about.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: Buffer.from('fake-about'),
        size: 2048,
      } as any;

      const result = await profileService.upsertProfile({}, { aboutImage: [mockFile] });

      expect(cloudinaryService.uploadImage).toHaveBeenCalledWith(
        mockFile.buffer,
        'portfolio/profile',
      );
      expect(cloudinaryService.deleteFile).toHaveBeenCalledWith('portfolio/profile/old_about');
      expect(result.aboutImage).toBe(
        'https://res.cloudinary.com/demo/image/upload/v88888/portfolio/profile/new_about.webp',
      );
    });

    it('should create new profile if none exists', async () => {
      jest.spyOn(Profile, 'findOne').mockResolvedValue(null as any);

      const newProfileData = {
        fullName: { en: 'Sokha Ly', kh: 'លី សុខា' },
        title: { en: 'DevOps Engineer', kh: 'វិស្វករ DevOps' },
        introduction: { en: 'Intro text', kh: 'អត្ថបទណែនាំ' },
        about: { en: 'About text', kh: 'អំពី' },
      };

      const result = await profileService.upsertProfile(newProfileData);

      expect(result.fullName.en).toBe('Sokha Ly');
      expect(result.title.en).toBe('DevOps Engineer');
    });
  });
});
