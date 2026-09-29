import mongoose, { Document, Schema, Model } from 'mongoose';
import { BilingualField } from '../types';
import { createBilingualSchema } from './Profile';

export type CertificationType = 'certification' | 'award' | 'achievement';

export interface ICertification extends Document {
  name: BilingualField;
  type: CertificationType;
  organization: BilingualField;
  issueDate: Date;
  expirationDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
  description?: BilingualField;
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CertificationModel = Model<ICertification>;

export const certificationSchema = new Schema<ICertification>(
  {
    name: {
      type: createBilingualSchema(true),
      required: [true, 'Certification name is required'],
    },
    type: {
      type: String,
      enum: {
        values: ['certification', 'award', 'achievement'],
        message: '{VALUE} is not a valid certification type',
      },
      required: [true, 'Certification type is required'],
    },
    organization: {
      type: createBilingualSchema(true),
      required: [true, 'Organization is required'],
    },
    issueDate: {
      type: Date,
      required: [true, 'Issue date is required'],
    },
    expirationDate: {
      type: Date,
    },
    credentialId: {
      type: String,
      trim: true,
    },
    credentialUrl: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    description: {
      type: createBilingualSchema(false),
    },
    isVisible: {
      type: Boolean,
      default: true,
      required: [true, 'isVisible flag is required'],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'certifications',
  },
);

// Compound index per PRD Section 11.9
certificationSchema.index({ type: 1, order: 1 });

export const Certification: CertificationModel =
  (mongoose.models.Certification as CertificationModel) ||
  mongoose.model<ICertification>('Certification', certificationSchema);

export default Certification;
