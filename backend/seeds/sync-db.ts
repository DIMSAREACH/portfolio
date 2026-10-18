import mongoose, { Types } from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../src/config/database';
import User, { IUser } from '../src/models/User';
import Profile from '../src/models/Profile';
import Category from '../src/models/Category';
import Skill from '../src/models/Skill';
import Experience from '../src/models/Experience';
import Education from '../src/models/Education';
import Certification from '../src/models/Certification';
import SocialLink from '../src/models/SocialLink';
import Settings from '../src/models/Settings';
import Project from '../src/models/Project';
import BlogPost from '../src/models/BlogPost';
import Message from '../src/models/Message';
import Media from '../src/models/Media';
import logger from '../src/utils/logger';

import {
  ADMIN_DEFAULTS,
  PROFILE_SEED,
  CATEGORIES_SEED,
  SKILLS_SEED,
  EXPERIENCE_SEED,
  EDUCATION_SEED,
  CERTIFICATIONS_SEED,
  SOCIAL_LINKS_SEED,
  SETTINGS_SEED,
  getProjectsSeed,
  getBlogPostsSeed,
  MESSAGES_SEED,
  MEDIA_SEED,
} from './seed';

async function syncDatabase(): Promise<void> {
  logger.info('Starting full database synchronization and integration...');

  await connectDatabase();

  try {
    // 1. Admin User
    let adminUser: IUser;
    const existingAdmin = await User.findOne({ email: ADMIN_DEFAULTS.email });
    if (existingAdmin) {
      adminUser = existingAdmin;
      logger.info(`Admin user verified (${adminUser.email}).`);
    } else {
      adminUser = await User.create({
        email: ADMIN_DEFAULTS.email,
        password: ADMIN_DEFAULTS.password,
        fullName: ADMIN_DEFAULTS.fullName,
        role: ADMIN_DEFAULTS.role,
        isActive: true,
      });
      logger.info(`Admin user created (${adminUser.email}).`);
    }

    // 2. Profile - Preserve uploaded images!
    let profile = await Profile.findOne();
    if (profile) {
      const savedProfileImage = profile.profileImage;
      const savedAboutImage = profile.aboutImage;
      // Update details while strictly preserving user's photos
      profile.fullName = PROFILE_SEED.fullName;
      profile.title = PROFILE_SEED.title;
      profile.introduction = PROFILE_SEED.introduction;
      profile.about = PROFILE_SEED.about;
      profile.professionalSummary = PROFILE_SEED.professionalSummary;
      profile.careerInterests = PROFILE_SEED.careerInterests;
      profile.background = PROFILE_SEED.background;
      profile.strengths = PROFILE_SEED.strengths;
      profile.goals = PROFILE_SEED.goals;
      profile.email = PROFILE_SEED.email;
      profile.phone = PROFILE_SEED.phone;
      profile.location = PROFILE_SEED.location;
      if (savedProfileImage) {
        profile.profileImage = savedProfileImage;
      }
      if (savedAboutImage) {
        profile.aboutImage = savedAboutImage;
      }
      await profile.save();
      logger.info('Profile synced with custom portrait preserved.');
    } else {
      profile = await Profile.create(PROFILE_SEED);
      logger.info('Profile created.');
    }

    if (profile?.profileImage && adminUser.avatar !== profile.profileImage) {
      adminUser.avatar = profile.profileImage;
      await adminUser.save();
      logger.info('Admin user avatar synced with profile photo.');
    }

    // 3. Categories
    await Category.deleteMany({});
    const categoryDocs = await Category.create(CATEGORIES_SEED);
    const categoryMap = new Map<string, Types.ObjectId>();
    categoryDocs.forEach((cat) => {
      categoryMap.set(cat.slug, cat._id as Types.ObjectId);
    });
    logger.info(`Categories synced (${categoryDocs.length} items).`);

    // 4. Skills
    await Skill.deleteMany({});
    await Skill.create(SKILLS_SEED);
    logger.info(`Skills synced (${SKILLS_SEED.length} items).`);

    // 5. Experiences
    await Experience.deleteMany({});
    await Experience.create(EXPERIENCE_SEED);
    logger.info(`Experiences synced (${EXPERIENCE_SEED.length} items).`);

    // 6. Education
    await Education.deleteMany({});
    await Education.create(EDUCATION_SEED);
    logger.info(`Education synced (${EDUCATION_SEED.length} items).`);

    // 7. Certifications
    await Certification.deleteMany({});
    await Certification.create(CERTIFICATIONS_SEED);
    logger.info(`Certifications synced (${CERTIFICATIONS_SEED.length} items).`);

    // 8. Social Links
    await SocialLink.deleteMany({});
    await SocialLink.create(SOCIAL_LINKS_SEED);
    logger.info(`Social links synced (${SOCIAL_LINKS_SEED.length} items).`);

    // 9. Settings
    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      await Settings.create(SETTINGS_SEED);
      logger.info('Settings seeded.');
    } else {
      logger.info('Settings preserved without overwriting CV or custom toggles.');
    }

    // 10. Projects
    await Project.deleteMany({});
    const projectsData = getProjectsSeed(categoryMap);
    await Project.create(projectsData);
    logger.info(`Projects synced (${projectsData.length} items).`);

    // 11. Blog Posts
    await BlogPost.deleteMany({});
    const blogPostsData = getBlogPostsSeed(categoryMap, adminUser._id as Types.ObjectId);
    await BlogPost.create(blogPostsData);
    logger.info(`Blog posts synced (${blogPostsData.length} items).`);

    // 12. Messages
    const messageCount = await Message.countDocuments();
    if (messageCount === 0) {
      await Message.create(MESSAGES_SEED);
      logger.info(`Messages seeded (${MESSAGES_SEED.length} items).`);
    }

    // 13. Media
    const mediaCount = await Media.countDocuments();
    if (mediaCount === 0) {
      await Media.create(MEDIA_SEED);
      logger.info(`Media seeded (${MEDIA_SEED.length} items).`);
    }

    logger.info('Database synchronization complete! All features are now fully integrated.');
  } finally {
    await disconnectDatabase();
  }
}

syncDatabase()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Database synced successfully.');
    process.exit(0);
  })
  .catch((err) => {
    logger.error('Database sync failed:', err);
    process.exit(1);
  });
