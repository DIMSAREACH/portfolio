import { Router } from 'express';
import socialLinkController from '../../controllers/admin/socialLink.controller';
import { validate } from '../../middleware/validate.middleware';
import {
  createSocialLinkValidator,
  updateSocialLinkValidator,
  reorderSocialLinksValidator,
  socialLinkIdParamValidator,
} from '../../validators/socialLink.validator';

const router = Router();

/**
 * GET /api/v1/admin/social-links
 * List all social links
 */
router.get('/', socialLinkController.getAll);

/**
 * POST /api/v1/admin/social-links
 * Create a new social link
 */
router.post('/', validate(createSocialLinkValidator), socialLinkController.create);

/**
 * PATCH /api/v1/admin/social-links/reorder
 * Reorder social links (Must be defined before /:id routes)
 */
router.patch('/reorder', validate(reorderSocialLinksValidator), socialLinkController.reorder);

/**
 * GET /api/v1/admin/social-links/:id
 * Retrieve a single social link
 */
router.get('/:id', validate(socialLinkIdParamValidator), socialLinkController.getById);

/**
 * PATCH /api/v1/admin/social-links/:id
 * Update an existing social link
 */
router.patch('/:id', validate(updateSocialLinkValidator), socialLinkController.update);

/**
 * DELETE /api/v1/admin/social-links/:id
 * Delete a social link
 */
router.delete('/:id', validate(socialLinkIdParamValidator), socialLinkController.delete);

export default router;
