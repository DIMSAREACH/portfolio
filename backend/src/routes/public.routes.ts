import { Router } from 'express';
import {
  getProfile,
  getProjects,
  getProjectBySlug,
  getSkills,
  getExperiences,
  getEducation,
  getCertifications,
  getCategories,
  getSocialLinks,
  getPublicSettings,
  submitContactForm,
  downloadCv,
  previewCv,
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

// CV Download & Preview (PUB-004)
router.get('/cv/download', downloadCv);
router.get('/cv/preview', previewCv);

export default router;
