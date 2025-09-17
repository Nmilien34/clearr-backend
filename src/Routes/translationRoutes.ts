import express from 'express';
import { translationController } from '../Controllers/translationController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// All translation routes require authentication
router.use(authenticateToken);

// Translation routes
router.post('/', translationController.createTranslation.bind(translationController));
router.get('/history/:userId', translationController.getTranslationHistory.bind(translationController));
router.get('/:translationId', translationController.getTranslation.bind(translationController));
router.post('/:translationId/regenerate', translationController.regenerateTranslation.bind(translationController));
router.patch('/:translationId/selected-version', translationController.updateSelectedVersion.bind(translationController));
router.delete('/:translationId', translationController.deleteTranslation.bind(translationController));

export default router;