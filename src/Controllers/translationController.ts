import { Request, Response } from 'express';
import { translationService } from '../services/translationServices';

export class TranslationController {

    /**
     * Create new translation
     * POST /api/translations
     */
    async createTranslation(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }

            const { translationInput, modeId } = req.body;

            if (!translationInput) {
                res.status(400).json({
                    success: false,
                    message: 'Translation input is required'
                });
                return;
            }

            const result = await translationService.translateMessage(userId, {
                translationInput,
                modeId
            });

            res.status(result.statusCode).json(result);

        } catch (error: any) {
            console.error('Create translation controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    /**
     * Get translation history for user
     * GET /api/translations/history/:userId
     */
    async getTranslationHistory(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const requestingUserId = req.user?.userId;
            const { limit = '20', skip = '0' } = req.query;

            // Users can only access their own history
            if (userId !== requestingUserId) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
                return;
            }

            const result = await translationService.getUserTranslations(
                userId!,
                parseInt(limit as string) || 20,
                parseInt(skip as string) || 0
            );

            res.status(result.statusCode).json(result);

        } catch (error: any) {
            console.error('Get translation history controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    /**
     * Get specific translation
     * GET /api/translations/:translationId
     */
    async getTranslation(req: Request, res: Response): Promise<void> {
        try {
            const { translationId } = req.params;
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }

            const result = await translationService.getTranslation(userId!, translationId!);
            res.status(result.statusCode).json(result);

        } catch (error: any) {
            console.error('Get translation controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    /**
     * Regenerate translation
     * POST /api/translations/:translationId/regenerate
     */
    async regenerateTranslation(req: Request, res: Response): Promise<void> {
        try {
            const { translationId } = req.params;
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }

            const result = await translationService.regenerateTranslation(userId!, translationId!);
            res.status(result.statusCode).json(result);

        } catch (error: any) {
            console.error('Regenerate translation controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    /**
     * Update selected version of translation
     * PATCH /api/translations/:translationId/selected-version
     */
    async updateSelectedVersion(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            const { selectedIndex } = req.body;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }

            if (selectedIndex === undefined || selectedIndex < 0) {
                res.status(400).json({
                    success: false,
                    message: 'Valid selected index is required'
                });
                return;
            }

            // This is a placeholder - you might want to add a selectedIndex field to the Translation model
            // For now, we'll just return success since the frontend manages which version is selected
            res.status(200).json({
                success: true,
                message: 'Selected version updated successfully'
            });

        } catch (error: any) {
            console.error('Update selected version controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    /**
     * Delete translation
     * DELETE /api/translations/:translationId
     */
    async deleteTranslation(req: Request, res: Response): Promise<void> {
        try {
            const { translationId } = req.params;
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }

            const result = await translationService.deleteTranslation(userId!, translationId!);
            res.status(result.statusCode).json(result);

        } catch (error: any) {
            console.error('Delete translation controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

export const translationController = new TranslationController();