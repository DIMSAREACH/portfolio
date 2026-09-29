import mongoose, { Document, Schema, Model } from 'mongoose';
import { BilingualField, BilingualArrayField } from '../types';

export interface IProfile extends Document {
  fullName: BilingualField;
  title: BilingualField;
  introduction: BilingualField;
  about: BilingualField;
  professionalSummary?: BilingualField;
  careerInterests?: BilingualField;
  background?: BilingualField;
  strengths?: BilingualArrayField;
  goals?: BilingualField;
  profileImage?: string;
  aboutImage?: string;
  email?: string;
  phone?: string;
  location?: BilingualField;
  createdAt: Date;
  updatedAt: Date;
}

export type ProfileModel = Model<IProfile>;

/**
 * Reusable schema factory for bilingual text fields { en, kh }
 */
export const createBilingualSchema = (required = false) =>
  new Schema<BilingualField>(
    {
      en: {
        type: String,
        required: required ? [true, 'English text is required'] : false,
        trim: true,
      },
      kh: {
        type: String,
        required: required ? [true, 'Khmer text is required'] : false,
        trim: true,
      },
    },
    { _id: false },
  );

/**
 * Reusable schema factory for bilingual array fields { en: [String], kh: [String] }
 */
export const createBilingualArraySchema = () =>
  new Schema<BilingualArrayField>(
    {
      en: {
        type: [String],
        default: [],
      },
      kh: {
        type: [String],
        default: [],
      },
    },
    { _id: false },
  );

export const profileSchema = new Schema<IProfile>(
  {
    fullName: {
      type: createBilingualSchema(true),
      required: [true, 'Full name is required'],
    },
    title: {
      type: createBilingualSchema(true),
      required: [true, 'Title is required'],
    },
    introduction: {
      type: createBilingualSchema(true),
      required: [true, 'Introduction is required'],
    },
    about: {
      type: createBilingualSchema(true),
      required: [true, 'About content is required'],
    },
    professionalSummary: {
      type: createBilingualSchema(false),
    },
    careerInterests: {
      type: createBilingualSchema(false),
    },
    background: {
      type: createBilingualSchema(false),
    },
    strengths: {
      type: createBilingualArraySchema(),
    },
    goals: {
      type: createBilingualSchema(false),
    },
    profileImage: {
      type: String,
      trim: true,
    },
    aboutImage: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: createBilingualSchema(false),
    },
  },
  {
    timestamps: true,
    collection: 'profile',
  },
);

export const Profile: ProfileModel =
  (mongoose.models.Profile as ProfileModel) ||
  mongoose.model<IProfile>('Profile', profileSchema);

export default Profile;
