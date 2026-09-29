import { Types } from 'mongoose';
import Project, { IProject, ProjectStatus } from '../models/Project';
import Category from '../models/Category';
import cloudinaryService from './cloudinary.service';
import { NotFoundError, ValidationError } from '../utils/AppError';
import { getPaginationParams, buildPaginationMetadata } from '../utils/pagination';
import { PaginatedData } from '../utils/apiResponse';
import slugify from '../utils/slugify';
import logger from '../utils/logger';

export interface ProjectListQuery {
  page?: string | number;
  limit?: string | number;
  status?: ProjectStatus;
  featured?: boolean | string;
  category?: string;
  tech?: string;
  search?: string;
}

export interface CreateProjectDto {
  title: { en: string; kh?: string };
  slug?: string;
  shortDescription: { en: string; kh?: string };
  fullDescription: { en: string; kh?: string };
  problem?: { en?: string; kh?: string };
  solution?: { en?: string; kh?: string };
  features?: { en?: string[]; kh?: string[] };
  technologies: string[];
  category: string;
  mainImage?: string;
  screenshots?: string[];
  githubUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
  startDate?: Date | string;
  completionDate?: Date | string;
  challenges?: { en?: string; kh?: string };
  lessonsLearned?: { en?: string; kh?: string };
  featured?: boolean;
  status?: ProjectStatus;
  order?: number;
}

export type UpdateProjectDto = Partial<CreateProjectDto>;

export interface UploadedProjectFiles {
  mainImage?: Express.Multer.File[];
  screenshots?: Express.Multer.File[];
}

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

export class ProjectService {
  /**
   * List all projects with pagination, filters, and text search
   */
  async getAll(query: ProjectListQuery = {}): Promise<PaginatedData<IProject>> {
    const { page, limit, skip } = getPaginationParams(query);
    const filter: Record<string, unknown> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.featured !== undefined) {
      filter.featured = String(query.featured) === 'true';
    }

    if (query.category) {
      filter.category = query.category;
    }

    if (query.tech) {
      filter.technologies = { $in: [new RegExp(query.tech, 'i')] };
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { 'title.en': searchRegex },
        { 'title.kh': searchRegex },
        { 'shortDescription.en': searchRegex },
        { 'shortDescription.kh': searchRegex },
        { technologies: { $in: [searchRegex] } },
      ];
    }

    const [items, total] = await Promise.all([
      Project.find(filter)
        .populate('category', 'name slug type')
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Project.countDocuments(filter),
    ]);

    const pagination = buildPaginationMetadata(total, page, limit);
    return { items, pagination };
  }

  /**
   * Get single project by ID with populated category
   */
  async getById(id: string): Promise<IProject> {
    const project = await Project.findById(id).populate('category', 'name slug type');
    if (!project) {
      throw new NotFoundError(`Project with ID ${id} not found`);
    }
    return project;
  }

  /**
   * Create a new project with optional image uploads
   */
  async create(
    data: CreateProjectDto,
    files?: UploadedProjectFiles,
  ): Promise<IProject> {
    // 1. Validate category existence
    const categoryDoc = await Category.findById(data.category);
    if (!categoryDoc) {
      throw new NotFoundError(`Category with ID ${data.category} not found`);
    }

    // 2. Handle mainImage upload
    if (files?.mainImage && files.mainImage.length > 0) {
      const uploaded = await cloudinaryService.uploadImage(
        files.mainImage[0].buffer,
        'portfolio/projects',
      );
      data.mainImage = uploaded.secureUrl;
    }

    if (!data.mainImage) {
      throw new ValidationError('Main image is required', [
        { field: 'mainImage', message: 'Main image is required' },
      ]);
    }

    // 3. Handle screenshots upload
    const uploadedScreenshots: string[] = [];
    if (files?.screenshots && files.screenshots.length > 0) {
      for (const file of files.screenshots) {
        const uploaded = await cloudinaryService.uploadImage(
          file.buffer,
          'portfolio/projects',
        );
        uploadedScreenshots.push(uploaded.secureUrl);
      }
    }

    if (data.screenshots && Array.isArray(data.screenshots)) {
      data.screenshots = [...data.screenshots, ...uploadedScreenshots];
    } else {
      data.screenshots = uploadedScreenshots;
    }

    // 4. Default Khmer text to English if omitted to satisfy model requirements
    data.title.kh = data.title.kh || data.title.en;
    data.shortDescription.kh = data.shortDescription.kh || data.shortDescription.en;
    data.fullDescription.kh = data.fullDescription.kh || data.fullDescription.en;

    // 5. Slug auto-generation fallback
    if (data.slug) {
      data.slug = slugify(data.slug);
    }

    const project = new Project(data);
    await project.save();
    return project.populate('category', 'name slug type');
  }

  /**
   * Update project by ID with optional new image uploads
   */
  async update(
    id: string,
    data: UpdateProjectDto,
    files?: UploadedProjectFiles,
  ): Promise<IProject> {
    const project = await Project.findById(id);
    if (!project) {
      throw new NotFoundError(`Project with ID ${id} not found`);
    }

    // 1. Verify category if updated
    if (data.category) {
      const categoryDoc = await Category.findById(data.category);
      if (!categoryDoc) {
        throw new NotFoundError(`Category with ID ${data.category} not found`);
      }
      project.category = categoryDoc._id as Types.ObjectId;
    }

    // 2. Handle mainImage replacement
    if (files?.mainImage && files.mainImage.length > 0) {
      const oldImage = project.mainImage;
      const uploaded = await cloudinaryService.uploadImage(
        files.mainImage[0].buffer,
        'portfolio/projects',
      );
      project.mainImage = uploaded.secureUrl;
      if (oldImage && oldImage !== uploaded.secureUrl) {
        await safeDeleteCloudinaryFile(oldImage);
      }
    } else if (data.mainImage) {
      project.mainImage = data.mainImage;
    }

    // 3. Handle additional screenshots
    if (files?.screenshots && files.screenshots.length > 0) {
      for (const file of files.screenshots) {
        const uploaded = await cloudinaryService.uploadImage(
          file.buffer,
          'portfolio/projects',
        );
        project.screenshots.push(uploaded.secureUrl);
      }
    }

    if (data.screenshots) {
      project.screenshots = data.screenshots;
    }

    // 4. Update bilingual and scalar fields
    if (data.title) {
      if (data.title.en) project.title.en = data.title.en;
      if (data.title.kh) project.title.kh = data.title.kh;
    }

    if (data.shortDescription) {
      if (data.shortDescription.en) project.shortDescription.en = data.shortDescription.en;
      if (data.shortDescription.kh) project.shortDescription.kh = data.shortDescription.kh;
    }

    if (data.fullDescription) {
      if (data.fullDescription.en) project.fullDescription.en = data.fullDescription.en;
      if (data.fullDescription.kh) project.fullDescription.kh = data.fullDescription.kh;
    }

    if (data.slug) {
      project.slug = slugify(data.slug);
    }

    if (data.problem) {
      project.problem = {
        en: data.problem.en || project.problem?.en || '',
        kh: data.problem.kh || project.problem?.kh || '',
      };
    }

    if (data.solution) {
      project.solution = {
        en: data.solution.en || project.solution?.en || '',
        kh: data.solution.kh || project.solution?.kh || '',
      };
    }

    if (data.features) {
      project.features = {
        en: data.features.en || project.features?.en || [],
        kh: data.features.kh || project.features?.kh || [],
      };
    }

    if (data.technologies) project.technologies = data.technologies;
    if (data.githubUrl !== undefined) project.githubUrl = data.githubUrl;
    if (data.liveUrl !== undefined) project.liveUrl = data.liveUrl;
    if (data.videoUrl !== undefined) project.videoUrl = data.videoUrl;
    if (data.startDate !== undefined) project.startDate = data.startDate ? new Date(data.startDate) : undefined;
    if (data.completionDate !== undefined) project.completionDate = data.completionDate ? new Date(data.completionDate) : undefined;
    if (data.featured !== undefined) project.featured = Boolean(data.featured);
    if (data.status) project.status = data.status;
    if (data.order !== undefined) project.order = data.order;

    await project.save();
    return project.populate('category', 'name slug type');
  }

  /**
   * Delete project by ID and cleanup its Cloudinary assets
   */
  async delete(id: string): Promise<void> {
    const project = await Project.findById(id);
    if (!project) {
      throw new NotFoundError(`Project with ID ${id} not found`);
    }

    // Clean up images in Cloudinary
    if (project.mainImage) {
      await safeDeleteCloudinaryFile(project.mainImage);
    }

    if (project.screenshots && project.screenshots.length > 0) {
      await Promise.all(project.screenshots.map((url) => safeDeleteCloudinaryFile(url)));
    }

    await Project.findByIdAndDelete(id);
  }
}

export const projectService = new ProjectService();
export default projectService;
