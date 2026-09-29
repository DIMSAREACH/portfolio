import { Types } from 'mongoose';
import BlogPost, { IBlogPost, BlogPostStatus } from '../models/BlogPost';
import Category from '../models/Category';
import cloudinaryService from './cloudinary.service';
import { NotFoundError } from '../utils/AppError';
import { getPaginationParams, buildPaginationMetadata } from '../utils/pagination';
import { PaginatedData } from '../utils/apiResponse';
import slugify from '../utils/slugify';
import logger from '../utils/logger';

export interface BlogListQuery {
  page?: string | number;
  limit?: string | number;
  status?: BlogPostStatus;
  category?: string;
  tag?: string;
  featured?: boolean | string;
  search?: string;
}

export interface CreateBlogPostDto {
  title: { en: string; kh?: string };
  slug?: string;
  excerpt: { en: string; kh?: string };
  content: { en: string; kh?: string };
  coverImage?: string;
  category: string;
  tags?: string[];
  status?: BlogPostStatus;
  featured?: boolean;
}

export type UpdateBlogPostDto = Partial<CreateBlogPostDto>;

export function extractPublicId(url: string): string | null {
  if (!url || !url.includes('cloudinary.com')) return null;
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;
  const afterUpload = parts[1];
  const withoutVersion = afterUpload.replace(/^v\d+\//, '');
  const lastDotIndex = withoutVersion.lastIndexOf('.');
  return lastDotIndex !== -1 ? withoutVersion.substring(0, lastDotIndex) : withoutVersion;
}

async function safeDeleteCloudinaryFile(url: string): Promise<void> {
  const publicId = extractPublicId(url);
  if (publicId) {
    try {
      await cloudinaryService.deleteFile(publicId);
    } catch (err) {
      logger.warn(`Could not delete Cloudinary file (${publicId}):`, err);
    }
  }
}

export class BlogService {
  /**
   * List blog posts with pagination, filters, and text search
   */
  async getAll(query: BlogListQuery = {}): Promise<PaginatedData<IBlogPost>> {
    const { page, limit, skip } = getPaginationParams(query);
    const filter: Record<string, unknown> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.featured !== undefined) {
      filter.featured = String(query.featured) === 'true';
    }

    if (query.category) {
      if (Types.ObjectId.isValid(query.category)) {
        filter.category = query.category;
      } else {
        const categoryDoc = await Category.findOne({ slug: query.category });
        if (categoryDoc) {
          filter.category = categoryDoc._id;
        } else {
          filter.category = new Types.ObjectId();
        }
      }
    }

    if (query.tag) {
      filter.tags = { $in: [new RegExp(query.tag, 'i')] };
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { 'title.en': searchRegex },
        { 'title.kh': searchRegex },
        { 'excerpt.en': searchRegex },
        { 'excerpt.kh': searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    const [items, total] = await Promise.all([
      BlogPost.find(filter)
        .populate([
          { path: 'category', select: 'name slug type' },
          { path: 'author', select: 'name email avatar' },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      BlogPost.countDocuments(filter),
    ]);

    const pagination = buildPaginationMetadata(total, page, limit);
    return { items, pagination };
  }

  /**
   * Get single blog post by ID
   */
  async getById(id: string): Promise<IBlogPost> {
    const post = await BlogPost.findById(id).populate([
      { path: 'category', select: 'name slug type' },
      { path: 'author', select: 'name email avatar' },
    ]);
    if (!post) {
      throw new NotFoundError(`Blog post with ID ${id} not found`);
    }
    return post;
  }

  /**
   * Get single blog post by slug with populated category and author, optionally incrementing viewCount
   */
  async getBySlug(
    slug: string,
    options: { incrementViews?: boolean; publishedOnly?: boolean } = {},
  ): Promise<IBlogPost> {
    const filter: Record<string, unknown> = { slug };
    if (options.publishedOnly) {
      filter.status = 'published';
    }

    let post: IBlogPost | null;
    if (options.incrementViews) {
      post = await BlogPost.findOneAndUpdate(filter, { $inc: { viewCount: 1 } }, { new: true }).populate([
        { path: 'category', select: 'name slug type' },
        { path: 'author', select: 'name email avatar' },
      ]);
    } else {
      post = await BlogPost.findOne(filter).populate([
        { path: 'category', select: 'name slug type' },
        { path: 'author', select: 'name email avatar' },
      ]);
    }

    if (!post) {
      throw new NotFoundError(`Blog post with slug '${slug}' not found`);
    }

    return post;
  }

  /**
   * Create a new blog post with optional cover image upload
   */
  async create(
    data: CreateBlogPostDto,
    authorId: string,
    file?: Express.Multer.File,
  ): Promise<IBlogPost> {
    const categoryDoc = await Category.findById(data.category);
    if (!categoryDoc) {
      throw new NotFoundError(`Category with ID ${data.category} not found`);
    }

    if (file) {
      const uploaded = await cloudinaryService.uploadImage(file.buffer, 'portfolio/blog');
      data.coverImage = uploaded.secureUrl;
    }

    data.title.kh = data.title.kh || data.title.en;
    data.excerpt.kh = data.excerpt.kh || data.excerpt.en;
    data.content.kh = data.content.kh || data.content.en;

    if (data.slug) {
      data.slug = slugify(data.slug);
    }

    const validAuthorId = Types.ObjectId.isValid(authorId)
      ? new Types.ObjectId(authorId)
      : new Types.ObjectId();

    const post = new BlogPost({
      ...data,
      author: validAuthorId,
    });

    await post.save();
    return post.populate([
      { path: 'category', select: 'name slug type' },
      { path: 'author', select: 'name email avatar' },
    ]);
  }

  /**
   * Update blog post by ID with optional new cover image upload
   */
  async update(
    id: string,
    data: UpdateBlogPostDto,
    file?: Express.Multer.File,
  ): Promise<IBlogPost> {
    const post = await BlogPost.findById(id);
    if (!post) {
      throw new NotFoundError(`Blog post with ID ${id} not found`);
    }

    if (data.category) {
      const categoryDoc = await Category.findById(data.category);
      if (!categoryDoc) {
        throw new NotFoundError(`Category with ID ${data.category} not found`);
      }
      post.category = categoryDoc._id as Types.ObjectId;
    }

    if (file) {
      const oldImage = post.coverImage;
      const uploaded = await cloudinaryService.uploadImage(file.buffer, 'portfolio/blog');
      post.coverImage = uploaded.secureUrl;
      if (oldImage && oldImage !== uploaded.secureUrl) {
        await safeDeleteCloudinaryFile(oldImage);
      }
    } else if (data.coverImage !== undefined) {
      post.coverImage = data.coverImage;
    }

    if (data.title) {
      if (data.title.en) post.title.en = data.title.en;
      if (data.title.kh) post.title.kh = data.title.kh;
    }

    if (data.excerpt) {
      if (data.excerpt.en) post.excerpt.en = data.excerpt.en;
      if (data.excerpt.kh) post.excerpt.kh = data.excerpt.kh;
    }

    if (data.content) {
      if (data.content.en) post.content.en = data.content.en;
      if (data.content.kh) post.content.kh = data.content.kh;
    }

    if (data.slug) {
      post.slug = slugify(data.slug);
    }

    if (data.tags !== undefined) post.tags = data.tags;
    if (data.featured !== undefined) post.featured = data.featured;
    if (data.status) {
      post.status = data.status;
      if (data.status === 'published' && !post.publishedAt) {
        post.publishedAt = new Date();
      }
    }

    await post.save();
    return post.populate([
      { path: 'category', select: 'name slug type' },
      { path: 'author', select: 'name email avatar' },
    ]);
  }

  /**
   * Delete blog post by ID and clean up Cloudinary cover image
   */
  async delete(id: string): Promise<void> {
    const post = await BlogPost.findById(id);
    if (!post) {
      throw new NotFoundError(`Blog post with ID ${id} not found`);
    }

    if (post.coverImage) {
      await safeDeleteCloudinaryFile(post.coverImage);
    }

    await BlogPost.findByIdAndDelete(id);
  }

  /**
   * Publish blog post
   */
  async publish(id: string): Promise<IBlogPost> {
    const post = await BlogPost.findById(id);
    if (!post) {
      throw new NotFoundError(`Blog post with ID ${id} not found`);
    }

    post.status = 'published';
    if (!post.publishedAt) {
      post.publishedAt = new Date();
    }

    await post.save();
    return post.populate([
      { path: 'category', select: 'name slug type' },
      { path: 'author', select: 'name email avatar' },
    ]);
  }

  /**
   * Unpublish blog post
   */
  async unpublish(id: string): Promise<IBlogPost> {
    const post = await BlogPost.findById(id);
    if (!post) {
      throw new NotFoundError(`Blog post with ID ${id} not found`);
    }

    post.status = 'draft';
    await post.save();
    return post.populate([
      { path: 'category', select: 'name slug type' },
      { path: 'author', select: 'name email avatar' },
    ]);
  }
}

export const blogService = new BlogService();
export default blogService;
