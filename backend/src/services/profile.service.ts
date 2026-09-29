import Profile, { IProfile } from '../models/Profile';
import cloudinaryService from './cloudinary.service';
import logger from '../utils/logger';
import { BilingualField, BilingualArrayField } from '../types';

export interface UploadedProfileFiles {
  profileImage?: Express.Multer.File[];
  aboutImage?: Express.Multer.File[];
}

export interface UpsertProfileDto {
  fullName?: BilingualField;
  title?: BilingualField;
  introduction?: BilingualField;
  about?: BilingualField;
  professionalSummary?: BilingualField;
  careerInterests?: BilingualField;
  background?: BilingualField;
  strengths?: BilingualArrayField;
  goals?: BilingualField;
  profileImage?: string;
  aboutImage?: string;
  email?: string;
  phone?: string;
  location?: BilingualField;
}

export function extractPublicId(url: string): string | null {
  if (!url || !url.includes('cloudinary.com')) return null;
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;
  const afterUpload = parts[1];
  const withoutVersion = afterUpload.replace(/^v\d+\//, '');
  const lastDotIndex = withoutVersion.lastIndexOf('.');
  return lastDotIndex !== -1 ? withoutVersion.substring(0, lastDotIndex) : withoutVersion;
}

async function safeDeleteCloudinaryFile(url: string): Promise<void> {
  const publicId = extractPublicId(url);
  if (publicId) {
    try {
      await cloudinaryService.deleteFile(publicId);
    } catch (err) {
      logger.warn(`Could not delete Cloudinary file (${publicId}):`, err);
    }
  }
}

export class ProfileService {
  /**
   * Get current profile (or null if none exists)
   */
  async getProfile(): Promise<IProfile | null> {
    return await Profile.findOne();
  }

  /**
   * Upsert profile (create if not found, otherwise update existing)
   */
  async upsertProfile(
    data: UpsertProfileDto,
    files?: UploadedProfileFiles,
  ): Promise<IProfile> {
    let profile = await Profile.findOne();

    // Handle profileImage upload
    if (files?.profileImage?.[0]) {
      const uploadResult = await cloudinaryService.uploadImage(
        files.profileImage[0].buffer,
        'portfolio/profile',
      );
      if (profile?.profileImage) {
        await safeDeleteCloudinaryFile(profile.profileImage);
      }
      data.profileImage = uploadResult.secureUrl;
    }

    // Handle aboutImage upload
    if (files?.aboutImage?.[0]) {
      const uploadResult = await cloudinaryService.uploadImage(
        files.aboutImage[0].buffer,
        'portfolio/profile',
      );
      if (profile?.aboutImage) {
        await safeDeleteCloudinaryFile(profile.aboutImage);
      }
      data.aboutImage = uploadResult.secureUrl;
    }

    if (profile) {
      // Update existing profile
      if (data.fullName) {
        profile.fullName = {
          en: data.fullName.en ?? profile.fullName.en,
          kh: data.fullName.kh ?? profile.fullName.kh,
        };
      }
      if (data.title) {
        profile.title = {
          en: data.title.en ?? profile.title.en,
          kh: data.title.kh ?? profile.title.kh,
        };
      }
      if (data.introduction) {
        profile.introduction = {
          en: data.introduction.en ?? profile.introduction.en,
          kh: data.introduction.kh ?? profile.introduction.kh,
        };
      }
      if (data.about) {
        profile.about = {
          en: data.about.en ?? profile.about.en,
          kh: data.about.kh ?? profile.about.kh,
        };
      }
      if (data.professionalSummary !== undefined) {
        profile.professionalSummary = data.professionalSummary;
      }
      if (data.careerInterests !== undefined) {
        profile.careerInterests = data.careerInterests;
      }
      if (data.background !== undefined) {
        profile.background = data.background;
      }
      if (data.strengths !== undefined) {
        profile.strengths = data.strengths;
      }
      if (data.goals !== undefined) {
        profile.goals = data.goals;
      }
      if (data.location !== undefined) {
        profile.location = data.location;
      }
      if (data.email !== undefined) {
        profile.email = data.email;
      }
      if (data.phone !== undefined) {
        profile.phone = data.phone;
      }
      if (data.profileImage !== undefined) {
        profile.profileImage = data.profileImage;
      }
      if (data.aboutImage !== undefined) {
        profile.aboutImage = data.aboutImage;
      }

      return await profile.save();
    }

    // Create new profile if none exists
    profile = new Profile(data);
    return await profile.save();
  }
}

export const profileService = new ProfileService();
export default profileService;
