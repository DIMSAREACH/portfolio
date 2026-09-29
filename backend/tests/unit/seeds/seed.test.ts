import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose, { Types } from 'mongoose';
import * as dbModule from '../../../src/config/database';
import User from '../../../src/models/User';
import Profile from '../../../src/models/Profile';
import Category from '../../../src/models/Category';
import Skill from '../../../src/models/Skill';
import Experience from '../../../src/models/Experience';
import Education from '../../../src/models/Education';
import Certification from '../../../src/models/Certification';
import SocialLink from '../../../src/models/SocialLink';
import Settings from '../../../src/models/Settings';
import Project from '../../../src/models/Project';
import BlogPost from '../../../src/models/BlogPost';
import Message from '../../../src/models/Message';
import Media from '../../../src/models/Media';
import logger from '../../../src/utils/logger';
import {
  seedDatabase,
  clearDatabase,
  ADMIN_DEFAULTS,
  PROFILE_SEED,
  CATEGORIES_SEED,
  SKILLS_SEED,
  EXPERIENCE_SEED,
  EDUCATION_SEED,
  CERTIFICATIONS_SEED,
  SOCIAL_LINKS_SEED,
  SETTINGS_SEED,
} from '../../../seeds/seed';

describe('Database Seed Script (backend/seeds/seed.ts)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };

    jest.spyOn(dbModule, 'connectDatabase').mockImplementation(() => Promise.resolve({} as any));
    jest.spyOn(dbModule, 'disconnectDatabase').mockImplementation(() => Promise.resolve());
    jest.spyOn(logger, 'info').mockImplementation(() => logger);
    jest.spyOn(logger, 'warn').mockImplementation(() => logger);
    jest.spyOn(logger, 'error').mockImplementation(() => logger);

    // Mock deleteMany for all models
    jest.spyOn(User, 'deleteMany').mockResolvedValue({} as any);
    jest.spyOn(Profile, 'deleteMany').mockResolvedValue({} as any);
    jest.spyOn(Category, 'deleteMany').mockResolvedValue({} as any);
    jest.spyOn(Skill, 'deleteMany').mockResolvedValue({} as any);
    jest.spyOn(Experience, 'deleteMany').mockResolvedValue({} as any);
    jest.spyOn(Education, 'deleteMany').mockResolvedValue({} as any);
    jest.spyOn(Certification, 'deleteMany').mockResolvedValue({} as any);
    jest.spyOn(SocialLink, 'deleteMany').mockResolvedValue({} as any);
    jest.spyOn(Settings, 'deleteMany').mockResolvedValue({} as any);
    jest.spyOn(Project, 'deleteMany').mockResolvedValue({} as any);
    jest.spyOn(BlogPost, 'deleteMany').mockResolvedValue({} as any);
    jest.spyOn(Message, 'deleteMany').mockResolvedValue({} as any);
    jest.spyOn(Media, 'deleteMany').mockResolvedValue({} as any);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  describe('clearDatabase', () => {
    it('should clear all 13 collections in non-production environments', async () => {
      process.env.NODE_ENV = 'development';

      await clearDatabase();

      expect(User.deleteMany).toHaveBeenCalledWith({});
      expect(Profile.deleteMany).toHaveBeenCalledWith({});
      expect(Category.deleteMany).toHaveBeenCalledWith({});
      expect(Skill.deleteMany).toHaveBeenCalledWith({});
      expect(Experience.deleteMany).toHaveBeenCalledWith({});
      expect(Education.deleteMany).toHaveBeenCalledWith({});
      expect(Certification.deleteMany).toHaveBeenCalledWith({});
      expect(SocialLink.deleteMany).toHaveBeenCalledWith({});
      expect(Settings.deleteMany).toHaveBeenCalledWith({});
      expect(Project.deleteMany).toHaveBeenCalledWith({});
      expect(BlogPost.deleteMany).toHaveBeenCalledWith({});
      expect(Message.deleteMany).toHaveBeenCalledWith({});
      expect(Media.deleteMany).toHaveBeenCalledWith({});
    });

    it('should throw an error in production when neither force nor ALLOW_PROD_SEED is set', async () => {
      process.env.NODE_ENV = 'production';
      delete process.env.ALLOW_PROD_SEED;

      await expect(clearDatabase()).rejects.toThrow(
        /Refusing to clear database in production environment/,
      );

      expect(User.deleteMany).not.toHaveBeenCalled();
    });

    it('should proceed in production when force is true', async () => {
      process.env.NODE_ENV = 'production';
      delete process.env.ALLOW_PROD_SEED;

      await clearDatabase(true);

      expect(User.deleteMany).toHaveBeenCalledWith({});
    });

    it('should proceed in production when ALLOW_PROD_SEED is true', async () => {
      process.env.NODE_ENV = 'production';
      process.env.ALLOW_PROD_SEED = 'true';

      await clearDatabase(false);

      expect(User.deleteMany).toHaveBeenCalledWith({});
    });
  });

  describe('seedDatabase', () => {
    const mockAdminId = new Types.ObjectId();
    const mockCatIds = [
      new Types.ObjectId(),
      new Types.ObjectId(),
      new Types.ObjectId(),
      new Types.ObjectId(),
      new Types.ObjectId(),
      new Types.ObjectId(),
    ];

    beforeEach(() => {
      // Mock User
      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      jest.spyOn(User, 'create').mockResolvedValue({
        _id: mockAdminId,
        email: ADMIN_DEFAULTS.email,
        fullName: ADMIN_DEFAULTS.fullName,
        role: ADMIN_DEFAULTS.role,
      } as any);

      // Mock Profile
      jest.spyOn(Profile, 'create').mockResolvedValue({} as any);

      // Mock Category
      const mockCategories = CATEGORIES_SEED.map((cat, idx) => ({
        _id: mockCatIds[idx],
        slug: cat.slug,
        name: cat.name,
      }));
      jest.spyOn(Category, 'create').mockResolvedValue(mockCategories as any);

      // Mock remaining models
      jest.spyOn(Skill, 'create').mockResolvedValue([] as any);
      jest.spyOn(Experience, 'create').mockResolvedValue([] as any);
      jest.spyOn(Education, 'create').mockResolvedValue([] as any);
      jest.spyOn(Certification, 'create').mockResolvedValue([] as any);
      jest.spyOn(SocialLink, 'create').mockResolvedValue([] as any);
      jest.spyOn(Settings, 'create').mockResolvedValue({} as any);
      jest.spyOn(Project, 'create').mockResolvedValue([] as any);
      jest.spyOn(BlogPost, 'create').mockResolvedValue([] as any);
      jest.spyOn(Message, 'create').mockResolvedValue([] as any);
      jest.spyOn(Media, 'create').mockResolvedValue([] as any);
    });

    it('should seed all 13 collections and return accurate summary', async () => {
      const summary = await seedDatabase({ clear: true, disconnectOnFinish: true });

      expect(dbModule.connectDatabase).toHaveBeenCalledTimes(1);
      expect(User.deleteMany).toHaveBeenCalledWith({});

      // Verify User
      expect(User.findOne).toHaveBeenCalledWith({ email: ADMIN_DEFAULTS.email });
      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: ADMIN_DEFAULTS.email,
          fullName: ADMIN_DEFAULTS.fullName,
        }),
      );

      // Verify Profile
      expect(Profile.create).toHaveBeenCalledWith(PROFILE_SEED);

      // Verify Category
      expect(Category.create).toHaveBeenCalledWith(CATEGORIES_SEED);

      // Verify Skills
      expect(Skill.create).toHaveBeenCalledWith(SKILLS_SEED);

      // Verify Experience & Education & Certifications & Social
      expect(Experience.create).toHaveBeenCalledWith(EXPERIENCE_SEED);
      expect(Education.create).toHaveBeenCalledWith(EDUCATION_SEED);
      expect(Certification.create).toHaveBeenCalledWith(CERTIFICATIONS_SEED);
      expect(SocialLink.create).toHaveBeenCalledWith(SOCIAL_LINKS_SEED);

      // Verify Settings
      expect(Settings.create).toHaveBeenCalledWith(SETTINGS_SEED);

      // Verify Projects
      expect(Project.create).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            slug: 'camtraffic-ai',
            category: mockCatIds[2], // 'ai-ml' index
          }),
          expect.objectContaining({
            slug: 'pharmacy-pos-inventory',
            category: mockCatIds[0], // 'web-application' index
          }),
        ]),
      );

      // Verify BlogPosts
      expect(BlogPost.create).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            slug: 'getting-started-with-angular-signals',
            author: mockAdminId,
          }),
        ]),
      );

      // Verify Messages & Media
      expect(Message.create).toHaveBeenCalled();
      expect(Media.create).toHaveBeenCalled();

      // Check summary
      expect(summary).toEqual({
        users: 1,
        profile: 1,
        categories: 6,
        skills: 12,
        experience: 2,
        education: 1,
        certifications: 2,
        socialLinks: 4,
        settings: 1,
        projects: 3,
        blogPosts: 3,
        messages: 2,
        media: 2,
      });

      expect(dbModule.disconnectDatabase).toHaveBeenCalledTimes(1);
    });

    it('should reuse existing admin user if found and not re-create admin', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue({
        _id: mockAdminId,
        email: ADMIN_DEFAULTS.email,
      } as any);

      await seedDatabase({ clear: false, disconnectOnFinish: true });

      expect(User.create).not.toHaveBeenCalled();
      expect(Project.create).toHaveBeenCalled();
      expect(BlogPost.create).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ author: mockAdminId })]),
      );
    });

    it('should handle errors cleanly and ensure database disconnect occurs', async () => {
      jest.spyOn(Profile, 'create').mockRejectedValue(new Error('Profile creation error'));

      await expect(
        seedDatabase({ clear: true, disconnectOnFinish: true }),
      ).rejects.toThrow('Profile creation error');

      expect(logger.error).toHaveBeenCalledWith(
        'Error during database seeding:',
        expect.any(Error),
      );
      expect(dbModule.disconnectDatabase).toHaveBeenCalledTimes(1);
    });

    it('should not disconnect if disconnectOnFinish is false', async () => {
      await seedDatabase({ clear: false, disconnectOnFinish: false });

      expect(dbModule.disconnectDatabase).not.toHaveBeenCalled();
    });
  });
});
