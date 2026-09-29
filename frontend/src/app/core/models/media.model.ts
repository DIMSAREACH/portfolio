import { BilingualField } from './api-response.model';

/**
 * Media Model
 * Aligned with PRD Section 11.13
 */

export interface Media {
  _id: string;
  fileName: string;
  url: string;
  publicId: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  altText?: BilingualField;
  folder?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
