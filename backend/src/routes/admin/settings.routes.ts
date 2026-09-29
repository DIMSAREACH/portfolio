import { Router } from 'express';
import settingsController from '../../controllers/admin/settings.controller';
import { validate } from '../../middleware/validate.middleware';
import { updateSettingsValidator } from '../../validators/settings.validator';

const router = Router();

/**
 * GET /api/v1/admin/settings
 * Retrieve site settings
 */
router.get('/', settingsController.getSettings);

/**
 * PUT /api/v1/admin/settings
 * Update or initialize (upsert) site settings
 */
router.put('/', validate(updateSettingsValidator), settingsController.updateSettings);

export default router;
