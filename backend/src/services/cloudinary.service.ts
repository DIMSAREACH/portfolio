import { UploadApiOptions, UploadApiResponse } from 'cloudinary';
import cloudinary from '../config/cloudinary';
import logger from '../utils/logger';

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes: number;
  resourceType: string;
}

export interface CloudinaryDeleteResult {
  result: string;
}

export class CloudinaryService {
  /**
   * Helper to upload a buffer stream to Cloudinary
   */
  private uploadFromBuffer(
    fileBuffer: Buffer,
    options: UploadApiOptions,
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        options,
        (error, result?: UploadApiResponse) => {
          if (error || !result) {
            logger.error('Cloudinary upload stream error:', error);
            return reject(error || new Error('Cloudinary upload failed'));
          }

          resolve({
            url: result.url,
            secureUrl: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
            resourceType: result.resource_type,
          });
        },
      );

      stream.end(fileBuffer);
    });
  }

  /**
   * Upload an image buffer to Cloudinary with automatic optimization (q_auto, f_auto)
   */
  async uploadImage(
    fileBuffer: Buffer,
    folder: string,
    publicId?: string,
  ): Promise<CloudinaryUploadResult> {
    const options: UploadApiOptions = {
      folder,
      resource_type: 'image',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    };

    if (publicId) {
      options.public_id = publicId;
    }

    return this.uploadFromBuffer(fileBuffer, options);
  }

  /**
   * Upload a raw document (e.g. PDF CV or certificate) to Cloudinary
   */
  async uploadPdf(
    fileBuffer: Buffer,
    folder: string,
    publicId?: string,
  ): Promise<CloudinaryUploadResult> {
    const options: UploadApiOptions = {
      folder,
      resource_type: 'raw',
    };

    if (publicId) {
      options.public_id = publicId;
    }

    return this.uploadFromBuffer(fileBuffer, options);
  }

  /**
   * Delete a file from Cloudinary by its publicId
   */
  async deleteFile(
    publicId: string,
    resourceType: 'image' | 'raw' | 'video' = 'image',
  ): Promise<CloudinaryDeleteResult> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      return result;
    } catch (error) {
      logger.error(`Error deleting Cloudinary file (${publicId}):`, error);
      throw error;
    }
  }
}

export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
