import { Router } from 'express';
import {
  getProfile,
  getProjects,
  getProjectBySlug,
  getSkills,
  getExperiences,
  getEducation,
  getCertifications,
  getBlogPosts,
  getBlogPostBySlug,
  getCategories,
  getSocialLinks,
  getPublicSettings,
} from '../controllers/public.controller';

const router = Router();

// Profile
router.get('/profile', getProfile);

// Projects
router.get('/projects', getProjects);
router.get('/projects/:slug', getProjectBySlug);

// Skills
router.get('/skills', getSkills);

// Experiences
router.get('/experiences', getExperiences);

// Education
router.get('/education', getEducation);

// Certifications
router.get('/certifications', getCertifications);

// Blog Posts
router.get('/blog', getBlogPosts);
router.get('/blog/:slug', getBlogPostBySlug);

// Categories
router.get('/categories', getCategories);

// Social Links
router.get('/social-links', getSocialLinks);

// Public Settings
router.get('/settings/public', getPublicSettings);

export default router;
