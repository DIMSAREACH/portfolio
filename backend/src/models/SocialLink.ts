import mongoose, { Document, Schema, Model } from 'mongoose';

export type SocialPlatform =
  | 'github'
  | 'linkedin'
  | 'facebook'
  | 'email'
  | 'twitter'
  | 'youtube'
  | 'other';

export interface ISocialLink extends Document {
  platform: SocialPlatform;
  label: string;
  url: string;
  icon?: string;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SocialLinkModel = Model<ISocialLink>;

export const socialLinkSchema = new Schema<ISocialLink>(
  {
    platform: {
      type: String,
      enum: {
        values: [
          'github',
          'linkedin',
          'facebook',
          'email',
          'twitter',
          'youtube',
          'other',
        ],
        message: '{VALUE} is not a valid social platform',
      },
      required: [true, 'Platform is required'],
    },
    label: {
      type: String,
      required: [true, 'Label is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
      required: [true, 'isVisible flag is required'],
    },
  },
  {
    timestamps: true,
    collection: 'socialLinks',
  },
);

// Index matching PRD Section 11.14
socialLinkSchema.index({ order: 1 });

export const SocialLink: SocialLinkModel =
  (mongoose.models.SocialLink as SocialLinkModel) ||
  mongoose.model<ISocialLink>('SocialLink', socialLinkSchema);

export default SocialLink;
