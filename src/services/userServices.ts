// services/user.service.ts
import User from '../models/userModels';
import Translation from '../models/translationModels';
import { IUser } from '../types/userTypes';
import { validateEmail } from '../utils/validatePhoneNumber';

export class UserService {

    /**
     * Get user profile by ID
     */
    async getUserById(userId: string): Promise<{
        success: boolean;
        data?: IUser;
        message: string;
        statusCode: number;
    }> {
        try {
            const user = await User.findById(userId);
            
            if (!user || !user.isActive) {
                return {
                    success: false,
                    message: 'User not found',
                    statusCode: 404
                };
            }

            return {
                success: true,
                data: user,
                message: 'User retrieved successfully',
                statusCode: 200
            };

        } catch (error: any) {
            console.error('Get user error:', error);
            return {
                success: false,
                message: 'Failed to retrieve user',
                statusCode: 500
            };
        }
    }

    /**
     * Update user profile
     */
    async updateUserProfile(userId: string, updateData: {
        fullName?: string;
        email?: string;
        preferredMode?: 'professional' | 'personal' | 'casual';
        notificationEnabled?: boolean;
        pushToken?: string;
    }): Promise<{
        success: boolean;
        data?: IUser;
        message: string;
        statusCode: number;
    }> {
        try {
            const user = await User.findById(userId);
            
            if (!user || !user.isActive) {
                return {
                    success: false,
                    message: 'User not found',
                    statusCode: 404
                };
            }

            // Validate email if provided
            if (updateData.email && !validateEmail(updateData.email)) {
                return {
                    success: false,
                    message: 'Invalid email format',
                    statusCode: 400
                };
            }

            // Validate full name if provided
            if (updateData.fullName && updateData.fullName.trim().length < 2) {
                return {
                    success: false,
                    message: 'Full name must be at least 2 characters',
                    statusCode: 400
                };
            }

            // Update fields
            if (updateData.fullName) user.fullName = updateData.fullName.trim();
            if (updateData.email !== undefined) user.email = updateData.email;
            if (updateData.preferredMode) user.preferredMode = updateData.preferredMode;
            if (updateData.notificationEnabled !== undefined) user.notificationEnabled = updateData.notificationEnabled;
            if (updateData.pushToken) user.pushToken = updateData.pushToken;

            await user.save();

            return {
                success: true,
                data: user,
                message: 'Profile updated successfully',
                statusCode: 200
            };

        } catch (error: any) {
            console.error('Update user error:', error);
            return {
                success: false,
                message: 'Failed to update profile',
                statusCode: 500
            };
        }
    }

    /**
     * Add training context for personalized translations
     */
    async addTrainingContext(userId: string, contextExample: string): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
    }> {
        try {
            const user = await User.findById(userId);
            
            if (!user || !user.isActive) {
                return {
                    success: false,
                    message: 'User not found',
                    statusCode: 404
                };
            }

            // Add context (limit to 10 examples)
            user.contextTraining.push(contextExample.trim());
            if (user.contextTraining.length > 10) {
                user.contextTraining = user.contextTraining.slice(-10); // Keep latest 10
            }

            await user.save();

            return {
                success: true,
                message: 'Training context added successfully',
                statusCode: 200
            };

        } catch (error: any) {
            console.error('Add training context error:', error);
            return {
                success: false,
                message: 'Failed to add training context',
                statusCode: 500
            };
        }
    }

    /**
     * Get user statistics (translation count, etc.)
     */
    async getUserStats(userId: string): Promise<{
        success: boolean;
        data?: {
            totalTranslations: number;
            translationsByMode: {
                professional: number;
                personal: number;
                casual: number;
            };
            joinedDate: Date;
        };
        message: string;
        statusCode: number;
    }> {
        try {
            const user = await User.findById(userId);
            
            if (!user || !user.isActive) {
                return {
                    success: false,
                    message: 'User not found',
                    statusCode: 404
                };
            }

            // Get translation statistics
            const totalTranslations = await Translation.countDocuments({ 
                userId, 
                isActive: true 
            });

            const translationsByMode = {
                professional: await Translation.countDocuments({ 
                    userId, 
                    mode: 'professional', 
                    isActive: true 
                }),
                personal: await Translation.countDocuments({ 
                    userId, 
                    mode: 'personal', 
                    isActive: true 
                }),
                casual: await Translation.countDocuments({ 
                    userId, 
                    mode: 'casual', 
                    isActive: true 
                })
            };

            return {
                success: true,
                data: {
                    totalTranslations,
                    translationsByMode,
                    joinedDate: user.createdAt
                },
                message: 'User statistics retrieved successfully',
                statusCode: 200
            };

        } catch (error: any) {
            console.error('Get user stats error:', error);
            return {
                success: false,
                message: 'Failed to retrieve user statistics',
                statusCode: 500
            };
        }
    }

    /**
     * Deactivate user account (soft delete)
     */
    async deactivateUser(userId: string): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
    }> {
        try {
            const user = await User.findById(userId);
            
            if (!user) {
                return {
                    success: false,
                    message: 'User not found',
                    statusCode: 404
                };
            }

            user.isActive = false;
            user.isDeleted = true;
            await user.save();

            return {
                success: true,
                message: 'Account deactivated successfully',
                statusCode: 200
            };

        } catch (error: any) {
            console.error('Deactivate user error:', error);
            return {
                success: false,
                message: 'Failed to deactivate account',
                statusCode: 500
            };
        }
    }
}

export const userService = new UserService();