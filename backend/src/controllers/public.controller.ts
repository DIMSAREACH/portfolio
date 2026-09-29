import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';
import { NotFoundError } from '../utils/AppError';
import profileService from '../services/profile.service';
import projectService from '../services/project.service';
import skillService from '../services/skill.service';
import experienceService from '../services/experience.service';
import educationService from '../services/education.service';
import certificationService from '../services/certification.service';
import blogService from '../services/blog.service';
import categoryService from '../services/category.service';
import socialLinkService from '../services/socialLink.service';
import settingsService from '../services/settings.service';
import { CategoryType } from '../models/Category';
import { ExperienceType } from '../models/Experience';
import { CertificationType } from '../models/Certification';

/**
 * 1. GET /api/v1/profile
 * Get public profile details
 */
export const getProfile = catchAsync(async (_req: Request, res: Response) => {
  const profile = await profileService.getProfile();
  if (!profile) {
    throw new NotFoundError('Profile not found');
  }
  return sendSuccess(res, profile, 'Profile retrieved successfully');
});

/**
 * 2. GET /api/v1/projects
 * List published projects with pagination, filters, and search
 */
export const getProjects = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, category, tech, search, featured, sort } = req.query;

  const data = await projectService.getAll({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : 6,
    status: 'published',
    category: category ? String(category) : undefined,
    tech: tech ? String(tech) : undefined,
    search: search ? String(search) : undefined,
    featured: featured !== undefined ? String(featured) : undefined,
    ...(sort ? { sort: String(sort) } : {}),
  });

  return sendPaginated(res, data.items, data.pagination, 'Projects retrieved successfully');
});

/**
 * 3. GET /api/v1/projects/:slug
 * Get published project by slug and atomically increment viewCount
 */
export const getProjectBySlug = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const project = await projectService.getBySlug(slug, {
    incrementViews: true,
    publishedOnly: true,
  });

  return sendSuccess(res, project, 'Project retrieved successfully');
});

/**
 * 4. GET /api/v1/skills
 * List visible skills
 */
export const getSkills = catchAsync(async (req: Request, res: Response) => {
  const result = await skillService.getAll({
    ...req.query,
    isVisible: true,
  });

  if (Array.isArray(result)) {
    return sendSuccess(res, result, 'Skills retrieved successfully');
  }

  return sendPaginated(res, result.items, result.pagination, 'Skills retrieved successfully');
});

/**
 * 5. GET /api/v1/experiences
 * List experiences with optional type filter
 */
export const getExperiences = catchAsync(async (req: Request, res: Response) => {
  const { type, search, page, limit } = req.query;

  const result = await experienceService.getAll({
    type: type as ExperienceType,
    search: search ? String(search) : undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });

  if (Array.isArray(result)) {
    return sendSuccess(res, result, 'Experiences retrieved successfully');
  }

  return sendPaginated(res, result.items, result.pagination, 'Experiences retrieved successfully');
});

/**
 * 6. GET /api/v1/education
 * List education entries
 */
export const getEducation = catchAsync(async (req: Request, res: Response) => {
  const result = await educationService.getAll(req.query);

  if (Array.isArray(result)) {
    return sendSuccess(res, result, 'Education entries retrieved successfully');
  }

  return sendPaginated(res, result.items, result.pagination, 'Education entries retrieved successfully');
});

/**
 * 7. GET /api/v1/certifications
 * List visible certifications with optional type filter
 */
export const getCertifications = catchAsync(async (req: Request, res: Response) => {
  const { type, search, page, limit } = req.query;

  const result = await certificationService.getAll({
    type: type as CertificationType,
    isVisible: true,
    search: search ? String(search) : undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });

  if (Array.isArray(result)) {
    return sendSuccess(res, result, 'Certifications retrieved successfully');
  }

  return sendPaginated(res, result.items, result.pagination, 'Certifications retrieved successfully');
});

/**
 * 8. GET /api/v1/blog
 * List published blog posts with pagination, filters, and search
 */
export const getBlogPosts = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, category, tag, search, featured } = req.query;

  const data = await blogService.getAll({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : 6,
    status: 'published',
    category: category ? String(category) : undefined,
    tag: tag ? String(tag) : undefined,
    search: search ? String(search) : undefined,
    featured: featured !== undefined ? String(featured) : undefined,
  });

  return sendPaginated(res, data.items, data.pagination, 'Blog posts retrieved successfully');
});

/**
 * 9. GET /api/v1/blog/:slug
 * Get published blog post by slug and atomically increment viewCount
 */
export const getBlogPostBySlug = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const post = await blogService.getBySlug(slug, {
    incrementViews: true,
    publishedOnly: true,
  });

  return sendSuccess(res, post, 'Blog post retrieved successfully');
});

/**
 * 10. GET /api/v1/categories
 * List categories with optional type filter
 */
export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const { type } = req.query;
  const categories = await categoryService.getAll({
    type: type as CategoryType,
  });

  return sendSuccess(res, categories, 'Categories retrieved successfully');
});

/**
 * 11. GET /api/v1/social-links
 * List visible social links
 */
export const getSocialLinks = catchAsync(async (_req: Request, res: Response) => {
  const socialLinks = await socialLinkService.getAll({
    isVisible: true,
  });

  return sendSuccess(res, socialLinks, 'Social links retrieved successfully');
});

/**
 * 12. GET /api/v1/settings/public
 * Get public subset of settings
 */
export const getPublicSettings = catchAsync(async (_req: Request, res: Response) => {
  const settings = await settingsService.getSettings();

  const publicSettings = {
    siteTitle: settings.siteTitle,
    siteDescription: settings.siteDescription,
    enableCvDownload: settings.enableCvDownload,
    enableContactForm: settings.enableContactForm,
  };

  return sendSuccess(res, publicSettings, 'Public settings retrieved successfully');
});
