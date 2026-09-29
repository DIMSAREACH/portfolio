import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { BilingualField, BilingualArrayField } from '../types';
import slugify from '../utils/slugify';
import { createBilingualSchema, createBilingualArraySchema } from './Profile';

export type ProjectStatus = 'draft' | 'published';

export interface IProject extends Document {
  title: BilingualField;
  slug: string;
  shortDescription: BilingualField;
  fullDescription: BilingualField;
  problem?: BilingualField;
  solution?: BilingualField;
  features?: BilingualArrayField;
  technologies: string[];
  category: Types.ObjectId;
  mainImage: string;
  screenshots: string[];
  githubUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
  startDate?: Date;
  completionDate?: Date;
  challenges?: BilingualField;
  lessonsLearned?: BilingualField;
  featured: boolean;
  status: ProjectStatus;
  order: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectModel = Model<IProject>;

export const projectSchema = new Schema<IProject>(
  {
    title: {
      type: createBilingualSchema(true),
      required: [true, 'Project title is required'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    shortDescription: {
      type: createBilingualSchema(true),
      required: [true, 'Short description is required'],
    },
    fullDescription: {
      type: createBilingualSchema(true),
      required: [true, 'Full description is required'],
    },
    problem: {
      type: createBilingualSchema(false),
    },
    solution: {
      type: createBilingualSchema(false),
    },
    features: {
      type: createBilingualArraySchema(),
    },
    technologies: {
      type: [String],
      required: [true, 'Technologies are required'],
      validate: {
        validator: (arr: string[]) => Array.isArray(arr) && arr.length > 0,
        message: 'At least one technology is required',
      },
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    mainImage: {
      type: String,
      required: [true, 'Main image is required'],
      trim: true,
    },
    screenshots: {
      type: [String],
      default: [],
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    completionDate: {
      type: Date,
    },
    challenges: {
      type: createBilingualSchema(false),
    },
    lessonsLearned: {
      type: createBilingualSchema(false),
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published'],
        message: '{VALUE} is not a valid project status',
      },
      default: 'draft',
      required: [true, 'Project status is required'],
    },
    order: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'projects',
  },
);

const autoGenerateSlug = (doc: IProject) => {
  if (!doc.slug && doc.title?.en) {
    doc.slug = slugify(doc.title.en);
  } else if (doc.slug) {
    doc.slug = slugify(doc.slug);
  }
};

// Auto-generate slug before validation
projectSchema.pre('validate', async function () {
  autoGenerateSlug(this);
});

// Auto-generate and check for collisions before saving
projectSchema.pre('save', async function () {
  autoGenerateSlug(this);

  if (this.isModified('slug') || this.isNew) {
    const ProjectModel = this.constructor as Model<IProject>;
    if (mongoose.connection.readyState === 1 && ProjectModel) {
      const existing = await ProjectModel.findOne({
        slug: this.slug,
        _id: { $ne: this._id },
      });
      if (existing) {
        const randomSuffix = Math.random().toString(36).substring(2, 7);
        this.slug = `${this.slug}-${randomSuffix}`;
      }
    }
  }
});

// Explicit compound & single field indexes matching PRD Section 11.5
projectSchema.index({ slug: 1 }, { unique: true });
projectSchema.index({ status: 1, featured: -1, order: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ technologies: 1 });

export const Project: ProjectModel =
  (mongoose.models.Project as ProjectModel) ||
  mongoose.model<IProject>('Project', projectSchema);

export default Project;
