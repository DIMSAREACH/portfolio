import mongoose, { Document, Schema, Model } from 'mongoose';
import { BilingualField } from '../types';
import slugify from '../utils/slugify';
import { createBilingualSchema } from './Profile';

export type CategoryType = 'project' | 'blog' | 'both';

export interface ICategory extends Document {
  name: BilingualField;
  slug: string;
  description?: BilingualField;
  type: CategoryType;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CategoryModel = Model<ICategory>;

export const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: createBilingualSchema(true),
      required: [true, 'Category name is required'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: createBilingualSchema(false),
    },
    type: {
      type: String,
      enum: {
        values: ['project', 'blog', 'both'],
        message: '{VALUE} is not a valid category type',
      },
      required: [true, 'Category type is required'],
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'categories',
  },
);

const autoGenerateSlug = (doc: ICategory) => {
  if (!doc.slug && doc.name?.en) {
    doc.slug = slugify(doc.name.en);
  } else if (doc.slug) {
    doc.slug = slugify(doc.slug);
  }
};

// Pre-validate & pre-save hooks: auto-generate slug from English name
categorySchema.pre('validate', async function () {
  autoGenerateSlug(this);
});

categorySchema.pre('save', async function () {
  autoGenerateSlug(this);
});

// Ensure explicit indexes match PRD Section 11.11
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ type: 1 });

export const Category: CategoryModel =
  (mongoose.models.Category as CategoryModel) ||
  mongoose.model<ICategory>('Category', categorySchema);

export default Category;
