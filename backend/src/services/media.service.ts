import Media, { IMedia } from '../models/Media';
import Settings, { ICvFile } from '../models/Settings';
import cloudinaryService from './cloudinary.service';
import r2Service from './r2.service';
import { NotFoundError, ValidationError } from '../utils/AppError';
import { getPaginationParams, buildPaginationMetadata } from '../utils/pagination';
import { PaginatedData } from '../utils/apiResponse';
import logger from '../utils/logger';
import { BilingualField } from '../types';
import { escapeRegex } from '../utils/sanitize';

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
      filter.mimeType = new RegExp(escapeRegex(query.mimeType), 'i');
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
   * Upload an image/video/file to Cloudflare R2 or Cloudinary and register in Media library
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

    let uploadResult: {
      secureUrl: string;
      publicId: string;
      bytes?: number;
      width?: number;
      height?: number;
    };

    if (r2Service.isAvailable()) {
      const isVideo = file.mimetype.startsWith('video/');
      const isPdf = file.mimetype === 'application/pdf';
      const resourceType = isVideo ? 'video' : isPdf ? 'raw' : 'image';
      uploadResult = await r2Service.uploadBuffer(
        file.buffer,
        folder,
        file.originalname,
        file.mimetype,
        resourceType,
      );
    } else {
      uploadResult = await cloudinaryService.uploadImage(file.buffer, folder);
    }

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
   * Delete media file from Cloudflare R2 / Cloudinary and database
   */
  async delete(id: string): Promise<void> {
    const media = await Media.findById(id);
    if (!media) {
      throw new NotFoundError(`Media with ID ${id} not found`);
    }

    try {
      if (
        r2Service.isAvailable() &&
        (media.publicId.includes('/') ||
          media.url.includes('.r2.dev') ||
          media.url.includes('r2.cloudflarestorage.com'))
      ) {
        await r2Service.deleteFile(media.publicId);
      } else {
        await cloudinaryService.deleteFile(media.publicId);
      }
    } catch (err) {
      logger.warn(`Could not delete storage file (${media.publicId}):`, err);
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

    // If an existing CV is registered, clean it up from storage
    if (settings.cvFile?.publicId) {
      try {
        if (
          r2Service.isAvailable() &&
          (settings.cvFile.publicId.includes('/') ||
            settings.cvFile.url?.includes('.r2.dev') ||
            settings.cvFile.url?.includes('r2.cloudflarestorage.com'))
        ) {
          await r2Service.deleteFile(settings.cvFile.publicId);
        } else {
          await cloudinaryService.deleteFile(settings.cvFile.publicId, 'raw');
        }
      } catch (err) {
        logger.warn(`Could not delete old storage CV (${settings.cvFile.publicId}):`, err);
      }
    }

    let uploadResult: { secureUrl: string; publicId: string };
    if (r2Service.isAvailable()) {
      uploadResult = await r2Service.uploadBuffer(
        file.buffer,
        'portfolio/cv',
        file.originalname,
        'application/pdf',
        'raw',
      );
    } else {
      uploadResult = await cloudinaryService.uploadPdf(file.buffer, 'portfolio/cv');
    }

    const cvData: ICvFile = {
      url: uploadResult.secureUrl,
      publicId: uploadResult.publicId,
      fileName: file.originalname,
    };

    settings.cvFile = cvData;
    settings.enableCvDownload = true;
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
      if (
        r2Service.isAvailable() &&
        (settings.cvFile.publicId.includes('/') ||
          settings.cvFile.url?.includes('.r2.dev') ||
          settings.cvFile.url?.includes('r2.cloudflarestorage.com'))
      ) {
        await r2Service.deleteFile(settings.cvFile.publicId);
      } else {
        await cloudinaryService.deleteFile(settings.cvFile.publicId, 'raw');
      }
    } catch (err) {
      logger.warn(`Could not delete storage CV (${settings.cvFile.publicId}):`, err);
    }

    settings.cvFile = undefined;
    settings.enableCvDownload = false;
    await settings.save();
  }
}

export const mediaService = new MediaService();
export const cvService = new CvService();

export default {
  mediaService,
  cvService,
};
