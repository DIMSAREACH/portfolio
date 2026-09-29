import mongoose, { Document, Schema, Model } from 'mongoose';
import { BilingualField, BilingualArrayField } from '../types';
import { createBilingualSchema, createBilingualArraySchema } from './Profile';

export type ExperienceType = 'work' | 'volunteer' | 'internship' | 'freelance';

export interface IExperience extends Document {
  title: BilingualField;
  organization: BilingualField;
  location?: BilingualField;
  type: ExperienceType;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description?: BilingualField;
  responsibilities?: BilingualArrayField;
  technologies: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ExperienceModel = Model<IExperience>;

export const experienceSchema = new Schema<IExperience>(
  {
    title: {
      type: createBilingualSchema(true),
      required: [true, 'Job/role title is required'],
    },
    organization: {
      type: createBilingualSchema(true),
      required: [true, 'Organization is required'],
    },
    location: {
      type: createBilingualSchema(false),
    },
    type: {
      type: String,
      enum: {
        values: ['work', 'volunteer', 'internship', 'freelance'],
        message: '{VALUE} is not a valid experience type',
      },
      required: [true, 'Experience type is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
    },
    isCurrent: {
      type: Boolean,
      default: false,
      required: [true, 'isCurrent flag is required'],
    },
    description: {
      type: createBilingualSchema(false),
    },
    responsibilities: {
      type: createBilingualArraySchema(),
    },
    technologies: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'experiences',
  },
);

// Compound index per PRD Section 11.7
experienceSchema.index({ order: 1, startDate: -1 });

export const Experience: ExperienceModel =
  (mongoose.models.Experience as ExperienceModel) ||
  mongoose.model<IExperience>('Experience', experienceSchema);

export default Experience;
