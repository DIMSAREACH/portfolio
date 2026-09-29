import { BilingualField } from './api-response.model';

/**
 * Site Settings Model
 * Aligned with PRD Section 11.15
 */

export interface CvFile {
  url: string;
  publicId: string;
  fileName: string;
}

export interface Settings {
  _id?: string;
  siteTitle: BilingualField;
  siteDescription: BilingualField;
  enableCvDownload: boolean;
  cvFile?: CvFile;
  cvDownloadCount: number;
  enableContactForm: boolean;
  emailNotifications: boolean;
  notificationEmail?: string;
  maintenanceMode: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
