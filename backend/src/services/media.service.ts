import Media, { IMedia } from '../models/Media';
import Settings, { ICvFile } from '../models/Settings';
import cloudinaryService from './cloudinary.service';
import { NotFoundError, ValidationError } from '../utils/AppError';
import { getPaginationParams, buildPaginationMetadata } from '../utils/pagination';
import { PaginatedData } from '../utils/apiResponse';
import logger from '../utils/logger';
import { BilingualField } from '../types';

export interface MediaListQuery {
  page?: string | number;
  limit?: string | number;
  folder?: string;
  mimeType?: string;
}

export class MediaService {
  /**
   * List media files with pagination and optional folder / mimeType filtering
   */
  async getAll(query: MediaListQuery = {}): Promise<PaginatedData<IMedia>> {
    const { page, limit, skip } = getPaginationParams(query);
    const filter: Record<string, unknown> = {};

    if (query.folder) {
      filter.folder = query.folder;
    }

    if (query.mimeType) {
      filter.mimeType = new RegExp(query.mimeType, 'i');
    }

    const [items, total] = await Promise.all([
      Media.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Media.countDocuments(filter),
    ]);

    return {
      items,
      pagination: buildPaginationMetadata(total, page, limit),
    };
  }

  /**
   * Get single media file by ID
   */
  async getById(id: string): Promise<IMedia> {
    const media = await Media.findById(id);
    if (!media) {
      throw new NotFoundError(`Media with ID ${id} not found`);
    }
    return media;
  }

  /**
   * Upload an image to Cloudinary and register in Media library
   */
  async upload(
    file?: Express.Multer.File,
    folder = 'portfolio/media',
    altText?: BilingualField,
  ): Promise<IMedia> {
    if (!file) {
      throw new ValidationError('No file provided for upload', [
        { field: 'file', message: 'No file provided for upload' },
      ]);
    }

    const uploadResult = await cloudinaryService.uploadImage(file.buffer, folder);

    const media = new Media({
      fileName: file.originalname,
      url: uploadResult.secureUrl,
      publicId: uploadResult.publicId,
      mimeType: file.mimetype,
      size: uploadResult.bytes || file.size,
      width: uploadResult.width,
      height: uploadResult.height,
      folder,
      altText,
    });

    return await media.save();
  }

  /**
   * Delete media file from Cloudinary and database
   */
  async delete(id: string): Promise<void> {
    const media = await Media.findById(id);
    if (!media) {
      throw new NotFoundError(`Media with ID ${id} not found`);
    }

    try {
      await cloudinaryService.deleteFile(media.publicId);
    } catch (err) {
      logger.warn(`Could not delete Cloudinary file (${media.publicId}):`, err);
    }

    await Media.findByIdAndDelete(id);
  }
}

export class CvService {
  /**
   * Get current CV file info
   */
  async getCv(): Promise<ICvFile | null> {
    const settings = await Settings.findOne();
    return settings?.cvFile || null;
  }

  /**
   * Upload and activate new CV PDF file
   */
  async uploadCv(file?: Express.Multer.File): Promise<ICvFile> {
    if (!file) {
      throw new ValidationError('No PDF file provided for CV upload', [
        { field: 'file', message: 'No PDF file provided for CV upload' },
      ]);
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({
        siteTitle: { en: 'Developer Portfolio', kh: 'គេហទំព័រផ្ទាល់ខ្លួន' },
        siteDescription: { en: 'Portfolio', kh: 'គេហទំព័រ' },
      });
    }

    // If an existing CV is registered, clean it up from Cloudinary
    if (settings.cvFile?.publicId) {
      try {
        await cloudinaryService.deleteFile(settings.cvFile.publicId, 'raw');
      } catch (err) {
        logger.warn(`Could not delete old Cloudinary CV (${settings.cvFile.publicId}):`, err);
      }
    }

    const uploadResult = await cloudinaryService.uploadPdf(file.buffer, 'portfolio/cv');

    const cvData: ICvFile = {
      url: uploadResult.secureUrl,
      publicId: uploadResult.publicId,
      fileName: file.originalname,
    };

    settings.cvFile = cvData;
    await settings.save();

    return cvData;
  }

  /**
   * Delete current CV file
   */
  async deleteCv(): Promise<void> {
    const settings = await Settings.findOne();
    if (!settings || !settings.cvFile) {
      throw new NotFoundError('No active CV found to delete');
    }

    try {
      await cloudinaryService.deleteFile(settings.cvFile.publicId, 'raw');
    } catch (err) {
      logger.warn(`Could not delete Cloudinary CV (${settings.cvFile.publicId}):`, err);
    }

    settings.cvFile = undefined;
    await settings.save();
  }
}

export const mediaService = new MediaService();
export const cvService = new CvService();

export default {
  mediaService,
  cvService,
};
