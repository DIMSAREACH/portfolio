import {
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getR2Client, isR2Configured } from '../config/r2';
import config from '../config/environment';
import logger from '../utils/logger';

export interface R2UploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  bytes: number;
  resourceType: 'image' | 'video' | 'raw';
  width?: number;
  height?: number;
  format?: string;
}

export class R2Service {
  /**
   * Check if Cloudflare R2 is configured and active
   */
  isAvailable(): boolean {
    return isR2Configured();
  }

  /**
   * Clean filename for S3 object key
   */
  private sanitizeKey(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_+/g, '_');
  }

  /**
   * Build the public URL for an uploaded key
   */
  getPublicUrl(key: string): string {
    if (config.R2_PUBLIC_URL) {
      const base = config.R2_PUBLIC_URL.replace(/\/$/, '');
      return `${base}/${key}`;
    }
    const endpoint = config.R2_ENDPOINT || 
      (config.R2_ACCOUNT_ID ? `https://${config.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : '');
    return `${endpoint}/${config.R2_BUCKET_NAME}/${key}`;
  }

  /**
   * Extract object key from a full URL
   */
  extractKeyFromUrl(url: string): string | null {
    if (!url) return null;

    if (config.R2_PUBLIC_URL && url.startsWith(config.R2_PUBLIC_URL.replace(/\/$/, ''))) {
      const base = config.R2_PUBLIC_URL.replace(/\/$/, '');
      return url.replace(`${base}/`, '');
    }

    // Fallback: match after bucket name or last 2 path segments
    const match = url.match(/r2\.cloudflarestorage\.com\/[^/]+\/(.+)$/);
    if (match) return match[1];

    const pubMatch = url.match(/https?:\/\/[^/]+\/(.+)$/);
    if (pubMatch) return pubMatch[1];

    return null;
  }

  /**
   * Upload buffer to Cloudflare R2
   */
  async uploadBuffer(
    buffer: Buffer,
    folder: string,
    fileName: string,
    mimeType: string,
    resourceType: 'image' | 'video' | 'raw' = 'image',
  ): Promise<R2UploadResult> {
    const client = getR2Client();
    const sanitizedName = this.sanitizeKey(fileName);
    const timestamp = Date.now();
    const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
    const key = `${cleanFolder}/${timestamp}-${sanitizedName}`;

    logger.info(`Uploading file to Cloudflare R2: ${key} (${mimeType}, ${buffer.length} bytes)`);

    const command = new PutObjectCommand({
      Bucket: config.R2_BUCKET_NAME || 'portfolio-media',
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    });

    await client.send(command);

    const publicUrl = this.getPublicUrl(key);
    const format = fileName.split('.').pop()?.toLowerCase();

    return {
      url: publicUrl,
      secureUrl: publicUrl,
      publicId: key,
      bytes: buffer.length,
      resourceType,
      format,
    };
  }

  /**
   * Delete an object from Cloudflare R2
   */
  async deleteFile(keyOrUrl: string): Promise<{ result: string }> {
    const key = this.extractKeyFromUrl(keyOrUrl) || keyOrUrl;
    const client = getR2Client();

    logger.info(`Deleting object from Cloudflare R2: ${key}`);

    try {
      const command = new DeleteObjectCommand({
        Bucket: config.R2_BUCKET_NAME || 'portfolio-media',
        Key: key,
      });

      await client.send(command);
      return { result: 'ok' };
    } catch (err) {
      logger.error(`Failed to delete object from R2 (${key}):`, err);
      throw err;
    }
  }

  /**
   * Check if an object exists in R2
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const client = getR2Client();
      await client.send(
        new HeadObjectCommand({
          Bucket: config.R2_BUCKET_NAME || 'portfolio-media',
          Key: key,
        }),
      );
      return true;
    } catch {
      return false;
    }
  }
}

export const r2Service = new R2Service();
export default r2Service;
