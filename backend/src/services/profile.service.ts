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

function parseBilingualField(val: unknown): BilingualField | undefined {
  if (!val) return undefined;
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return { en: val, kh: val };
    }
  }
  return val as BilingualField;
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

    const fullName = parseBilingualField(data.fullName);
    const title = parseBilingualField(data.title);
    const introduction = parseBilingualField(data.introduction);
    const about = parseBilingualField(data.about);
    const location = parseBilingualField(data.location);
    const professionalSummary = parseBilingualField(data.professionalSummary);
    const careerInterests = parseBilingualField(data.careerInterests);
    const background = parseBilingualField(data.background);
    const goals = parseBilingualField(data.goals);

    if (profile) {
      // Update existing profile
      if (fullName) {
        profile.fullName = {
          en: fullName.en ?? profile.fullName.en,
          kh: fullName.kh ?? profile.fullName.kh,
        };
      }
      if (title) {
        profile.title = {
          en: title.en ?? profile.title.en,
          kh: title.kh ?? profile.title.kh,
        };
      }
      if (introduction) {
        profile.introduction = {
          en: introduction.en ?? profile.introduction.en,
          kh: introduction.kh ?? profile.introduction.kh,
        };
      }
      if (about) {
        profile.about = {
          en: about.en ?? profile.about.en,
          kh: about.kh ?? profile.about.kh,
        };
      }
      if (professionalSummary !== undefined) {
        profile.professionalSummary = professionalSummary;
      }
      if (careerInterests !== undefined) {
        profile.careerInterests = careerInterests;
      }
      if (background !== undefined) {
        profile.background = background;
      }
      if (data.strengths !== undefined) {
        profile.strengths = data.strengths;
      }
      if (goals !== undefined) {
        profile.goals = goals;
      }
      if (location !== undefined) {
        profile.location = location;
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
    const newProfileData: Record<string, unknown> = { ...data };
    if (fullName) newProfileData.fullName = fullName;
    if (title) newProfileData.title = title;
    if (introduction) newProfileData.introduction = introduction;
    if (about) newProfileData.about = about;
    if (location) newProfileData.location = location;
    if (professionalSummary) newProfileData.professionalSummary = professionalSummary;
    if (careerInterests) newProfileData.careerInterests = careerInterests;
    if (background) newProfileData.background = background;
    if (goals) newProfileData.goals = goals;

    profile = new Profile(newProfileData);
    return await profile.save();
  }
}

export const profileService = new ProfileService();
export default profileService;
