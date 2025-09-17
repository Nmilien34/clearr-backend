import express from 'express';
import { userController } from '../Controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);

// User profile routes
router.get('/:userId', userController.getUserProfile.bind(userController));
router.get('/:userId/stats', userController.getUserStats.bind(userController));

// Mode management routes
router.get('/:userId/modes', userController.getUserModes.bind(userController));
router.put('/:userId/modes/:modeId', userController.updateMode.bind(userController));
router.post('/:userId/modes', userController.createMode.bind(userController));
router.delete('/:userId/modes/:modeId', userController.deleteMode.bind(userController));
router.put('/:userId/selected-mode', userController.updateSelectedMode.bind(userController));

export default router;