import mongoose, { Document, Schema, Model } from 'mongoose';
import { BilingualField } from '../types';
import { createBilingualSchema } from './Profile';

export interface IMedia extends Document {
  fileName: string;
  url: string;
  publicId: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  altText?: BilingualField;
  folder?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MediaModel = Model<IMedia>;

export const mediaSchema = new Schema<IMedia>(
  {
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
    },
    publicId: {
      type: String,
      required: [true, 'Public ID is required'],
      unique: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      trim: true,
    },
    size: {
      type: Number,
      required: [true, 'File size is required'],
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    altText: {
      type: createBilingualSchema(false),
    },
    folder: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'media',
  },
);

// Explicit indexes matching PRD Section 11.13
mediaSchema.index({ publicId: 1 }, { unique: true });
mediaSchema.index({ mimeType: 1 });
mediaSchema.index({ createdAt: -1 });

export const Media: MediaModel =
  (mongoose.models.Media as MediaModel) ||
  mongoose.model<IMedia>('Media', mediaSchema);

export default Media;
