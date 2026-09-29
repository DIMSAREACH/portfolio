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
  submitContactForm,
  downloadCv,
} from '../controllers/public.controller';
import { contactLimiter } from '../middleware/rateLimiter.middleware';
import { validate } from '../middleware/validate.middleware';
import { contactFormValidator } from '../validators/contact.validator';

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

// Contact Form Submission (PUB-003)
router.post(
  '/contact',
  contactLimiter,
  validate(contactFormValidator),
  submitContactForm,
);

// CV Download (PUB-004)
router.get('/cv/download', downloadCv);

export default router;
