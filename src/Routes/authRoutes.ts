import express from 'express';
import { authController } from '../Controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes (no authentication required)
router.post('/send-otp', authController.sendOTP.bind(authController));
router.post('/verify-otp', authController.verifyOTP.bind(authController));

// Protected routes (authentication required)
router.post('/update-profile', authenticateToken, authController.updateProfile.bind(authController));
router.post('/complete-onboarding', authenticateToken, authController.completeOnboarding.bind(authController));
router.post('/delete-account', authenticateToken, authController.deleteAccount.bind(authController));

export default router;