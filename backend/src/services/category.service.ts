import Category, { ICategory, CategoryType } from '../models/Category';
import Project from '../models/Project';
import BlogPost from '../models/BlogPost';
import { NotFoundError, ConflictError } from '../utils/AppError';
import slugify from '../utils/slugify';

export interface CategoryFilter {
  type?: CategoryType;
}

export interface CreateCategoryDto {
  name: {
    en: string;
    kh?: string;
  };
  slug?: string;
  description?: {
    en?: string;
    kh?: string;
  };
  type: CategoryType;
  order?: number;
}

export interface UpdateCategoryDto {
  name?: {
    en?: string;
    kh?: string;
  };
  slug?: string;
  description?: {
    en?: string;
    kh?: string;
  };
  type?: CategoryType;
  order?: number;
}

export class CategoryService {
  /**
   * Retrieve all categories sorted by order and creation date
   */
  async getAll(filter: CategoryFilter = {}): Promise<ICategory[]> {
    const query: Record<string, unknown> = {};
    if (filter.type) {
      // If filtering by type (e.g. project), include categories of that type or 'both'
      query.$or = [{ type: filter.type }, { type: 'both' }];
    }

    return Category.find(query).sort({ order: 1, createdAt: 1 });
  }

  /**
   * Retrieve a single category by its MongoDB ObjectId
   */
  async getById(id: string): Promise<ICategory> {
    const category = await Category.findById(id);
    if (!category) {
      throw new NotFoundError(`Category with ID ${id} not found`);
    }
    return category;
  }

  /**
   * Create a new category with unique slug
   */
  async create(data: CreateCategoryDto): Promise<ICategory> {
    const targetSlug = data.slug
      ? slugify(data.slug)
      : data.name?.en
        ? slugify(data.name.en)
        : '';

    if (targetSlug) {
      const existing = await Category.findOne({ slug: targetSlug });
      if (existing) {
        throw new ConflictError(
          `A category with slug '${targetSlug}' already exists.`,
        );
      }
      data.slug = targetSlug;
    }

    const category = new Category(data);
    return category.save();
  }

  /**
   * Update an existing category by ID
   */
  async update(id: string, data: UpdateCategoryDto): Promise<ICategory> {
    const category = await Category.findById(id);
    if (!category) {
      throw new NotFoundError(`Category with ID ${id} not found`);
    }

    if (data.slug) {
      const formattedSlug = slugify(data.slug);
      const existing = await Category.findOne({
        slug: formattedSlug,
        _id: { $ne: id },
      });
      if (existing) {
        throw new ConflictError(
          `A category with slug '${formattedSlug}' already exists.`,
        );
      }
      category.slug = formattedSlug;
    }

    if (data.name) {
      if (data.name.en) category.name.en = data.name.en;
      if (data.name.kh !== undefined) category.name.kh = data.name.kh;
    }

    if (data.description) {
      if (!category.description) {
        category.description = { en: '', kh: '' };
      }
      if (data.description.en !== undefined) category.description.en = data.description.en;
      if (data.description.kh !== undefined) category.description.kh = data.description.kh;
    }

    if (data.type) {
      category.type = data.type;
    }

    if (data.order !== undefined) {
      category.order = data.order;
    }

    return category.save();
  }

  /**
   * Delete category by ID after verifying it is not referenced by projects or blog posts
   */
  async delete(id: string): Promise<void> {
    const category = await Category.findById(id);
    if (!category) {
      throw new NotFoundError(`Category with ID ${id} not found`);
    }

    const [projectCount, blogCount] = await Promise.all([
      Project.countDocuments({ category: id }),
      BlogPost.countDocuments({ category: id }),
    ]);

    if (projectCount > 0 || blogCount > 0) {
      throw new ConflictError(
        `Cannot delete category. It is referenced by ${projectCount} project(s) and ${blogCount} blog post(s).`,
      );
    }

    await Category.findByIdAndDelete(id);
  }
}

export const categoryService = new CategoryService();
export default categoryService;
