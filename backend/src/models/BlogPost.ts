import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { BilingualField } from '../types';
import slugify from '../utils/slugify';
import calculateReadingTime from '../utils/readingTime';
import { createBilingualSchema } from './Profile';

export type BlogPostStatus = 'draft' | 'published';

export interface IBlogPost extends Document {
  title: BilingualField;
  slug: string;
  excerpt: BilingualField;
  content: BilingualField;
  coverImage?: string;
  category: Types.ObjectId;
  tags: string[];
  status: BlogPostStatus;
  featured: boolean;
  publishedAt?: Date;
  readingTime: number;
  viewCount: number;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type BlogPostModel = Model<IBlogPost>;

export const blogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: createBilingualSchema(true),
      required: [true, 'Blog post title is required'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    excerpt: {
      type: createBilingualSchema(true),
      required: [true, 'Excerpt is required'],
    },
    content: {
      type: createBilingualSchema(true),
      required: [true, 'Content is required'],
    },
    coverImage: {
      type: String,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published'],
        message: '{VALUE} is not a valid blog post status',
      },
      default: 'draft',
      required: [true, 'Status is required'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    readingTime: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
  },
  {
    timestamps: true,
    collection: 'blogPosts',
  },
);

const autoGenerateSlug = (doc: IBlogPost) => {
  if (!doc.slug && doc.title?.en) {
    doc.slug = slugify(doc.title.en);
  } else if (doc.slug) {
    doc.slug = slugify(doc.slug);
  }
};

const updateReadingTime = (doc: IBlogPost) => {
  if (doc.content?.en) {
    doc.readingTime = calculateReadingTime(doc.content.en);
  } else if (doc.content?.kh) {
    doc.readingTime = calculateReadingTime(doc.content.kh);
  }
};

// Auto-generate slug and calculate reading time on validate
blogPostSchema.pre('validate', async function () {
  autoGenerateSlug(this);
  updateReadingTime(this);
});

// Auto-generate slug, reading time, publishedAt, and collision check on save
blogPostSchema.pre('save', async function () {
  autoGenerateSlug(this);
  updateReadingTime(this);

  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  if (this.isModified('slug') || this.isNew) {
    const BlogPostModel = this.constructor as Model<IBlogPost>;
    if (mongoose.connection.readyState === 1 && BlogPostModel) {
      const existing = await BlogPostModel.findOne({
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

// Explicit indexes matching PRD Section 11.10
blogPostSchema.index({ slug: 1 }, { unique: true });
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ tags: 1 });

export const BlogPost: BlogPostModel =
  (mongoose.models.BlogPost as BlogPostModel) ||
  mongoose.model<IBlogPost>('BlogPost', blogPostSchema);

export default BlogPost;
