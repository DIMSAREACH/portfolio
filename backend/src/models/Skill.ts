import mongoose, { Document, Schema, Model } from 'mongoose';
import { BilingualField } from '../types';
import { createBilingualSchema } from './Profile';

export interface ISkill extends Document {
  name: string;
  category: BilingualField;
  icon?: string;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SkillModel = Model<ISkill>;

export const skillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: createBilingualSchema(true),
      required: [true, 'Skill category is required'],
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
    collection: 'skills',
  },
);

// Compound index per PRD Section 11.6
skillSchema.index({ category: 1, order: 1 });

export const Skill: SkillModel =
  (mongoose.models.Skill as SkillModel) ||
  mongoose.model<ISkill>('Skill', skillSchema);

export default Skill;
