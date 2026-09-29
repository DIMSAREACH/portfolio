import mongoose, { Document, Schema, Model } from 'mongoose';
import { BilingualField } from '../types';
import { createBilingualSchema } from './Profile';

export interface ICvFile {
  url: string;
  publicId: string;
  fileName: string;
}

export interface ISettings extends Document {
  siteTitle: BilingualField;
  siteDescription: BilingualField;
  enableCvDownload: boolean;
  cvFile?: ICvFile;
  cvDownloadCount: number;
  enableContactForm: boolean;
  emailNotifications: boolean;
  notificationEmail?: string;
  maintenanceMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SettingsModel = Model<ISettings>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cvFileSchema = new Schema<ICvFile>(
  {
    url: {
      type: String,
      required: [true, 'CV URL is required'],
      trim: true,
    },
    publicId: {
      type: String,
      required: [true, 'CV public ID is required'],
      trim: true,
    },
    fileName: {
      type: String,
      required: [true, 'CV file name is required'],
      trim: true,
    },
  },
  { _id: false },
);

export const settingsSchema = new Schema<ISettings>(
  {
    siteTitle: {
      type: createBilingualSchema(true),
      required: [true, 'Site title is required'],
    },
    siteDescription: {
      type: createBilingualSchema(true),
      required: [true, 'Site description is required'],
    },
    enableCvDownload: {
      type: Boolean,
      default: true,
      required: [true, 'enableCvDownload flag is required'],
    },
    cvFile: {
      type: cvFileSchema,
    },
    cvDownloadCount: {
      type: Number,
      default: 0,
    },
    enableContactForm: {
      type: Boolean,
      default: true,
      required: [true, 'enableContactForm flag is required'],
    },
    emailNotifications: {
      type: Boolean,
      default: true,
      required: [true, 'emailNotifications flag is required'],
    },
    notificationEmail: {
      type: String,
      lowercase: true,
      trim: true,
      match: [emailRegex, 'Please provide a valid notification email address'],
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
      required: [true, 'maintenanceMode flag is required'],
    },
  },
  {
    timestamps: true,
    collection: 'settings',
  },
);

export const Settings: SettingsModel =
  (mongoose.models.Settings as SettingsModel) ||
  mongoose.model<ISettings>('Settings', settingsSchema);

export default Settings;
