import { Request, Response } from 'express';
import { authService } from '../services/authSevices';
import { userService } from '../services/userServices';

export class AuthController {

    /**
     * Send OTP to phone number
     * POST /api/send-otp
     */
    async sendOTP(req: Request, res: Response): Promise<void> {
        try {
            const { phoneNumber } = req.body;

            if (!phoneNumber) {
                res.status(400).json({
                    success: false,
                    message: 'Phone number is required'
                });
                return;
            }

            const result = await authService.sendOTP(phoneNumber);
            res.status(result.statusCode).json(result);

        } catch (error: any) {
            console.error('Send OTP controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    /**
     * Verify OTP and authenticate user
     * POST /api/verify-otp
     */
    async verifyOTP(req: Request, res: Response): Promise<void> {
        try {
            const { phoneNumber, otpCode, fullName, email } = req.body;

            if (!phoneNumber || !otpCode) {
                res.status(400).json({
                    success: false,
                    message: 'Phone number and OTP code are required'
                });
                return;
            }

            const result = await authService.verifyOTPAndAuth(
                phoneNumber,
                otpCode,
                { fullName, email }
            );

            res.status(result.statusCode).json(result);

        } catch (error: any) {
            console.error('Verify OTP controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    /**
     * Update user profile
     * POST /api/update-profile
     */
    async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }

            const { fullName, email, preferredMode, notificationEnabled, pushToken } = req.body;

            const result = await userService.updateUserProfile(userId, {
                fullName,
                email,
                preferredMode,
                notificationEnabled,
                pushToken
            });

            res.status(result.statusCode).json(result);

        } catch (error: any) {
            console.error('Update profile controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    /**
     * Complete user onboarding
     * POST /api/complete-onboarding
     */
    async completeOnboarding(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }

            const { preferredMode, notificationEnabled } = req.body;

            const result = await userService.updateUserProfile(userId, {
                preferredMode: preferredMode || 'personal',
                notificationEnabled: notificationEnabled !== undefined ? notificationEnabled : true
            });

            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: 'Onboarding completed successfully',
                    data: result.data
                });
            } else {
                res.status(result.statusCode).json(result);
            }

        } catch (error: any) {
            console.error('Complete onboarding controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    /**
     * Delete user account
     * POST /api/delete-account
     */
    async deleteAccount(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            const { confirmDelete, reason } = req.body;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }

            // Require confirmation for security
            if (!confirmDelete || confirmDelete !== true) {
                res.status(400).json({
                    success: false,
                    message: 'Account deletion must be confirmed'
                });
                return;
            }

            const result = await userService.deactivateUser(userId);

            // Log deletion reason if provided (for analytics)
            if (reason && result.success) {
                console.log(`Account deleted - User: ${userId}, Reason: ${reason}`);
            }

            res.status(result.statusCode).json(result);

        } catch (error: any) {
            console.error('Delete account controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

export const authController = new AuthController();