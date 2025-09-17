import { Request, Response } from 'express';
import { userService } from '../services/userServices';
import { modeService } from '../services/modeServices';

export class UserController {

    /**
     * Get user profile
     * GET /api/users/:userId
     */
    async getUserProfile(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const requestingUserId = req.user?.userId;

            // Users can only access their own profile
            if (userId !== requestingUserId) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
                return;
            }

            const result = await userService.getUserById(userId!);
            res.status(result.statusCode).json(result);

        } catch (error: any) {
            console.error('Get user profile controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    /**
     * Get user's modes
     * GET /api/users/:userId/modes
     */
    async getUserModes(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const requestingUserId = req.user?.userId;

            // Users can only access their own modes
            if (userId !== requestingUserId) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
                return;
            }

            const result = await modeService.getUserModes(userId!);
            res.status(result.statusCode).json(result);

        } catch (error: any) {
            console.error('Get user modes controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    /**
     * Update specific mode
     * PUT /api/users/:userId/modes/:modeId
     */
    async updateMode(req: Request, res: Response): Promise<void> {
        try {
            const { userId, modeId } = req.params;
            const requestingUserId = req.user?.userId;

            // Users can only update their own modes
            if (userId !== requestingUserId) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
                return;
            }

            const { name, description, isDefault } = req.body;

            const result = await modeService.updateMode(userId!, modeId!, {
                name,
                description,
                isDefault
            });

            res.status(result.statusCode).json(result);

        } catch (error: any) {
            console.error('Update mode controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    /**
     * Create new custom mode
     * POST /api/users/:userId/modes
     */
    async createMode(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const requestingUserId = req.user?.userId;

            // Users can only create modes for themselves
            if (userId !== requestingUserId) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
                return;
            }

            const { name, description, isDefault, prompt } = req.body;

            const result = await modeService.createMode(userId!, {
                name,
                description,
                isDefault,
                prompt
            });

            res.status(result.statusCode).json(result);

        } catch (error: any) {
            console.error('Create mode controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    /**
     * Delete mode
     * DELETE /api/users/:userId/modes/:modeId
     */
    async deleteMode(req: Request, res: Response): Promise<void> {
        try {
            const { userId, modeId } = req.params;
            const requestingUserId = req.user?.userId;

            // Users can only delete their own modes
            if (userId !== requestingUserId) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
                return;
            }

            const result = await modeService.deleteMode(userId!, modeId!);
            res.status(result.statusCode).json(result);

        } catch (error: any) {
            console.error('Delete mode controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    /**
     * Update selected mode
     * PUT /api/users/:userId/selected-mode
     */
    async updateSelectedMode(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const requestingUserId = req.user?.userId;

            // Users can only update their own selected mode
            if (userId !== requestingUserId) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
                return;
            }

            const { modeId } = req.body;

            if (!modeId) {
                res.status(400).json({
                    success: false,
                    message: 'Mode ID is required'
                });
                return;
            }

            const result = await modeService.setSelectedMode(userId!, modeId);
            res.status(result.statusCode).json(result);

        } catch (error: any) {
            console.error('Update selected mode controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    /**
     * Get user statistics
     * GET /api/users/:userId/stats
     */
    async getUserStats(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const requestingUserId = req.user?.userId;

            // Users can only access their own stats
            if (userId !== requestingUserId) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
                return;
            }

            const result = await userService.getUserStats(userId!);
            res.status(result.statusCode).json(result);

        } catch (error: any) {
            console.error('Get user stats controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

export const userController = new UserController();