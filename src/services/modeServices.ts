import { Mode, ModePrompt } from '../models/modeModels';
import User from '../models/userModels';
import { IMode, IModePrompt } from '../types/modeTypes';

export class ModeService {

    /**
     * Create a new mode for a user
     */
    async createMode(
        userId: string,
        modeData: {
            name: string;
            description: string;
            isDefault?: boolean;
            prompt?: string;
        }
    ): Promise<{
        success: boolean;
        message: string;
        data?: {
            mode: IMode;
            prompt?: IModePrompt;
        };
        statusCode: number;
    }> {
        try {
            // Check if user exists
            const user = await User.findById(userId);
            if (!user || !user.isActive) {
                return {
                    success: false,
                    message: 'User not found',
                    statusCode: 404
                };
            }

            // Validate input
            if (!modeData.name || modeData.name.trim().length < 2) {
                return {
                    success: false,
                    message: 'Mode name must be at least 2 characters',
                    statusCode: 400
                };
            }

            if (!modeData.description || modeData.description.trim().length < 5) {
                return {
                    success: false,
                    message: 'Mode description must be at least 5 characters',
                    statusCode: 400
                };
            }

            // If this is set as default, unset other defaults for this user
            if (modeData.isDefault) {
                await Mode.updateMany(
                    { userId, isActive: true },
                    { isDefault: false }
                );
            }

            // Create the mode
            const mode = new Mode({
                userId,
                name: modeData.name.trim(),
                description: modeData.description.trim(),
                isDefault: modeData.isDefault || false
            });

            await mode.save();

            // Create associated prompt if provided
            let prompt: any;
            if (modeData.prompt && modeData.prompt.trim().length > 0) {
                prompt = new ModePrompt({
                    modeId: mode._id,
                    prompt: modeData.prompt.trim()
                });
                await prompt.save();
            }

            return {
                success: true,
                message: 'Mode created successfully',
                data: {
                    mode,
                    ...(prompt && { prompt })
                },
                statusCode: 201
            };

        } catch (error: any) {
            console.error('Create mode error:', error);
            return {
                success: false,
                message: 'Failed to create mode',
                statusCode: 500
            };
        }
    }

    /**
     * Get all modes for a user
     */
    async getUserModes(userId: string): Promise<{
        success: boolean;
        message: string;
        data?: IMode[];
        statusCode: number;
    }> {
        try {
            const modes = await Mode.find({
                userId,
                isActive: true
            }).sort({ isDefault: -1, createdAt: -1 });

            return {
                success: true,
                message: 'Modes retrieved successfully',
                data: modes,
                statusCode: 200
            };

        } catch (error: any) {
            console.error('Get user modes error:', error);
            return {
                success: false,
                message: 'Failed to retrieve modes',
                statusCode: 500
            };
        }
    }

    /**
     * Update a specific mode
     */
    async updateMode(
        userId: string,
        modeId: string,
        updateData: {
            name?: string;
            description?: string;
            isDefault?: boolean;
        }
    ): Promise<{
        success: boolean;
        message: string;
        data?: IMode;
        statusCode: number;
    }> {
        try {
            const mode = await Mode.findOne({
                _id: modeId,
                userId,
                isActive: true
            });

            if (!mode) {
                return {
                    success: false,
                    message: 'Mode not found',
                    statusCode: 404
                };
            }

            // Validate updates
            if (updateData.name && updateData.name.trim().length < 2) {
                return {
                    success: false,
                    message: 'Mode name must be at least 2 characters',
                    statusCode: 400
                };
            }

            if (updateData.description && updateData.description.trim().length < 5) {
                return {
                    success: false,
                    message: 'Mode description must be at least 5 characters',
                    statusCode: 400
                };
            }

            // If setting as default, unset other defaults
            if (updateData.isDefault) {
                await Mode.updateMany(
                    { userId, isActive: true, _id: { $ne: modeId } },
                    { isDefault: false }
                );
            }

            // Update fields
            if (updateData.name) mode.name = updateData.name.trim();
            if (updateData.description) mode.description = updateData.description.trim();
            if (updateData.isDefault !== undefined) mode.isDefault = updateData.isDefault;

            await mode.save();

            return {
                success: true,
                message: 'Mode updated successfully',
                data: mode,
                statusCode: 200
            };

        } catch (error: any) {
            console.error('Update mode error:', error);
            return {
                success: false,
                message: 'Failed to update mode',
                statusCode: 500
            };
        }
    }

    /**
     * Delete a mode (soft delete)
     */
    async deleteMode(
        userId: string,
        modeId: string
    ): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
    }> {
        try {
            const mode = await Mode.findOne({
                _id: modeId,
                userId,
                isActive: true
            });

            if (!mode) {
                return {
                    success: false,
                    message: 'Mode not found',
                    statusCode: 404
                };
            }

            // Check if this is the default mode
            if (mode.isDefault) {
                // Check if user has other modes
                const otherModes = await Mode.find({
                    userId,
                    isActive: true,
                    _id: { $ne: modeId }
                });

                if (otherModes.length > 0) {
                    // Set the first other mode as default
                    const firstMode = otherModes[0];
                    if (firstMode) {
                        firstMode.isDefault = true;
                        await firstMode.save();
                    }
                }
            }

            // Soft delete the mode
            mode.isActive = false;
            await mode.save();

            // Also soft delete associated prompts
            await ModePrompt.updateMany(
                { modeId },
                { isActive: false }
            );

            return {
                success: true,
                message: 'Mode deleted successfully',
                statusCode: 200
            };

        } catch (error: any) {
            console.error('Delete mode error:', error);
            return {
                success: false,
                message: 'Failed to delete mode',
                statusCode: 500
            };
        }
    }

    /**
     * Set selected/default mode for user
     */
    async setSelectedMode(
        userId: string,
        modeId: string
    ): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
    }> {
        try {
            const mode = await Mode.findOne({
                _id: modeId,
                userId,
                isActive: true
            });

            if (!mode) {
                return {
                    success: false,
                    message: 'Mode not found',
                    statusCode: 404
                };
            }

            // Unset all defaults for this user
            await Mode.updateMany(
                { userId, isActive: true },
                { isDefault: false }
            );

            // Set this mode as default
            mode.isDefault = true;
            await mode.save();

            return {
                success: true,
                message: 'Selected mode updated successfully',
                statusCode: 200
            };

        } catch (error: any) {
            console.error('Set selected mode error:', error);
            return {
                success: false,
                message: 'Failed to update selected mode',
                statusCode: 500
            };
        }
    }

    /**
     * Get mode with its active prompt
     */
    async getModeWithPrompt(modeId: string): Promise<{
        mode: IMode | null;
        prompt: IModePrompt | null;
    }> {
        try {
            const mode = await Mode.findOne({
                _id: modeId,
                isActive: true
            });

            if (!mode) {
                return { mode: null, prompt: null };
            }

            const prompt = await ModePrompt.findOne({
                modeId,
                isActive: true
            });

            return { mode, prompt };

        } catch (error: any) {
            console.error('Get mode with prompt error:', error);
            return { mode: null, prompt: null };
        }
    }

    /**
     * Get user's default mode
     */
    async getUserDefaultMode(userId: string): Promise<IMode | null> {
        try {
            return await Mode.findOne({
                userId,
                isDefault: true,
                isActive: true
            });
        } catch (error: any) {
            console.error('Get user default mode error:', error);
            return null;
        }
    }
}

export const modeService = new ModeService();