import mongoose, { Document, Schema, Model } from 'mongoose';
import { BilingualField, BilingualArrayField } from '../types';
import { createBilingualSchema, createBilingualArraySchema } from './Profile';

export interface IEducation extends Document {
  institution: BilingualField;
  degree: BilingualField;
  field: BilingualField;
  startYear: number;
  endYear?: number;
  description?: BilingualField;
  activities?: BilingualArrayField;
  gpa?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type EducationModel = Model<IEducation>;

export const educationSchema = new Schema<IEducation>(
  {
    institution: {
      type: createBilingualSchema(true),
      required: [true, 'Institution is required'],
    },
    degree: {
      type: createBilingualSchema(true),
      required: [true, 'Degree is required'],
    },
    field: {
      type: createBilingualSchema(true),
      required: [true, 'Field of study is required'],
    },
    startYear: {
      type: Number,
      required: [true, 'Start year is required'],
    },
    endYear: {
      type: Number,
    },
    description: {
      type: createBilingualSchema(false),
    },
    activities: {
      type: createBilingualArraySchema(),
    },
    gpa: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'education',
  },
);

// Compound index per PRD Section 11.8
educationSchema.index({ order: 1, startYear: -1 });

export const Education: EducationModel =
  (mongoose.models.Education as EducationModel) ||
  mongoose.model<IEducation>('Education', educationSchema);

export default Education;
