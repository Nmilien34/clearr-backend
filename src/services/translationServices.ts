// services/translation.service.ts
import Translation from '../models/translationModels';
import User from '../models/userModels';
import { ITranslation } from '../types/translationTypes';
// import { validateTranslation } from '../utils/validateTranslation';
import { getTranslationPrompt, shouldBlockContent } from '../utils/translationPrompts';
import { modeService } from './modeServices';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']!
});

export class TranslationService {

    /**
     * Main translation function
     */
    async translateMessage(
        userId: string,
        translationData: {
            translationInput: string;
            modeId?: string; // Optional - will use default mode if not provided
        }
    ): Promise<{
        success: boolean;
        message: string;
        data?: {
            translation: ITranslation;
            translationOutput: string[];
        };
        statusCode: number;
    }> {
        try {
            // Validate input
            if (!translationData.translationInput || translationData.translationInput.trim().length === 0) {
                return {
                    success: false,
                    message: 'Translation input is required',
                    statusCode: 400
                };
            }

            // Get user for context
            const user = await User.findById(userId);
            if (!user || !user.isActive) {
                return {
                    success: false,
                    message: 'User not found or inactive',
                    statusCode: 404
                };
            }

            // Get mode to use
            let modeId = translationData.modeId;
            if (!modeId) {
                // Use user's default mode
                const defaultMode = await modeService.getUserDefaultMode(userId);
                if (!defaultMode) {
                    return {
                        success: false,
                        message: 'No default mode found. Please create a mode first.',
                        statusCode: 400
                    };
                }
                modeId = defaultMode._id.toString();
            }

            // Get mode and its prompt
            const { mode, prompt } = await modeService.getModeWithPrompt(modeId);
            if (!mode) {
                return {
                    success: false,
                    message: 'Mode not found',
                    statusCode: 404
                };
            }

            // Verify the mode belongs to the user
            if (mode.userId.toString() !== userId) {
                return {
                    success: false,
                    message: 'Access denied to this mode',
                    statusCode: 403
                };
            }

            // Check for harmful content (only extreme cases)
            if (shouldBlockContent(translationData.translationInput)) {
                return {
                    success: false,
                    message: 'Cannot process this type of content',
                    statusCode: 400
                };
            }

            // Generate translation using OpenAI
            const translationOutput = await this.processWithOpenAI(
                translationData.translationInput,
                mode,
                prompt,
                user.contextTraining
            );

            // Save translation to database
            const translation = new Translation({
                userId: user._id,
                mode: mode.name, // Store mode name for backwards compatibility
                translationInput: translationData.translationInput,
                translationOutput: translationOutput,
                isActive: true
            });

            await translation.save();

            // Update user's translation history
            user.translationIds.push(translation._id);
            await user.save();

            return {
                success: true,
                message: 'Translation completed successfully',
                data: {
                    translation,
                    translationOutput
                },
                statusCode: 200
            };

        } catch (error: any) {
            console.error('Translation error:', error);
            return {
                success: false,
                message: 'Translation failed',
                statusCode: 500
            };
        }
    }

    /**
     * Process translation with OpenAI
     */
    private async processWithOpenAI(
        input: string,
        mode: any,
        modePrompt: any,
        context?: string[]
    ): Promise<string[]> {
        try {
            let finalPrompt: string;

            if (modePrompt && modePrompt.prompt) {
                // Use custom prompt from mode
                finalPrompt = this.buildCustomPrompt(input, mode, modePrompt.prompt, context);
            } else {
                // Fall back to default prompt system
                finalPrompt = getTranslationPrompt(input, mode.name.toLowerCase(), context);
            }

            const response = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert communication coach. Transform messages to be constructive while preserving authentic intent.'
                    },
                    {
                        role: 'user',
                        content: finalPrompt
                    }
                ],
                max_tokens: 200,
                temperature: 0.7
            });

            const translatedText = response.choices[0]?.message?.content?.trim();

            if (!translatedText) {
                throw new Error('No response from OpenAI');
            }

            // Return as array (could be multiple options in future)
            return [translatedText];

        } catch (error: any) {
            console.error('OpenAI API error:', error);
            throw new Error('Failed to process translation');
        }
    }

    /**
     * Build custom prompt using mode's prompt template
     */
    private buildCustomPrompt(
        input: string,
        mode: any,
        modePrompt: string,
        context?: string[]
    ): string {
        let prompt = `Mode: ${mode.name}
Description: ${mode.description}

Instructions: ${modePrompt}

Original message: "${input}"

Please transform this message according to the mode description and instructions above.`;

        if (context && context.length > 0) {
            const contextString = context.slice(0, 3).join('; ');
            prompt = `User's communication style examples: ${contextString}\n\n${prompt}\n\nAdapt the response to match the user's natural style.`;
        }

        return prompt;
    }

    /**
     * Get user's translation history
     */
    async getUserTranslations(
        userId: string,
        limit: number = 20,
        skip: number = 0
    ): Promise<{
        success: boolean;
        data?: ITranslation[];
        message: string;
        statusCode: number;
    }> {
        try {
            const translations = await Translation.find({ 
                userId, 
                isActive: true 
            })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

            return {
                success: true,
                data: translations,
                message: 'Translation history retrieved',
                statusCode: 200
            };

        } catch (error: any) {
            console.error('Get translations error:', error);
            return {
                success: false,
                message: 'Failed to retrieve translations',
                statusCode: 500
            };
        }
    }

    /**
     * Delete a translation
     */
    async deleteTranslation(
        userId: string,
        translationId: string
    ): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
    }> {
        try {
            const translation = await Translation.findOne({
                _id: translationId,
                userId: userId
            });

            if (!translation) {
                return {
                    success: false,
                    message: 'Translation not found',
                    statusCode: 404
                };
            }

            translation.isActive = false;
            await translation.save();

            return {
                success: true,
                message: 'Translation deleted successfully',
                statusCode: 200
            };

        } catch (error: any) {
            console.error('Delete translation error:', error);
            return {
                success: false,
                message: 'Failed to delete translation',
                statusCode: 500
            };
        }
    }

    /**
     * Regenerate a translation with different output
     */
    async regenerateTranslation(
        userId: string,
        translationId: string
    ): Promise<{
        success: boolean;
        message: string;
        data?: {
            translation: ITranslation;
            newOutput: string[];
        };
        statusCode: number;
    }> {
        try {
            const translation = await Translation.findOne({
                _id: translationId,
                userId: userId,
                isActive: true
            });

            if (!translation) {
                return {
                    success: false,
                    message: 'Translation not found',
                    statusCode: 404
                };
            }

            // Get user for context
            const user = await User.findById(userId);
            if (!user || !user.isActive) {
                return {
                    success: false,
                    message: 'User not found',
                    statusCode: 404
                };
            }

            // Get user's default mode for regeneration
            const defaultMode = await modeService.getUserDefaultMode(userId);
            if (!defaultMode) {
                return {
                    success: false,
                    message: 'No default mode found',
                    statusCode: 400
                };
            }

            const { mode, prompt } = await modeService.getModeWithPrompt(defaultMode._id.toString());

            // Generate new translation
            const newOutput = await this.processWithOpenAI(
                translation.translationInput,
                mode,
                prompt,
                user.contextTraining
            );

            // Add new output to existing outputs
            const updatedOutputs = [...translation.translationOutput, ...newOutput];
            translation.translationOutput = updatedOutputs;
            await translation.save();

            return {
                success: true,
                message: 'Translation regenerated successfully',
                data: {
                    translation,
                    newOutput
                },
                statusCode: 200
            };

        } catch (error: any) {
            console.error('Regenerate translation error:', error);
            return {
                success: false,
                message: 'Failed to regenerate translation',
                statusCode: 500
            };
        }
    }

    /**
     * Get specific translation
     */
    async getTranslation(
        userId: string,
        translationId: string
    ): Promise<{
        success: boolean;
        message: string;
        data?: ITranslation;
        statusCode: number;
    }> {
        try {
            const translation = await Translation.findOne({
                _id: translationId,
                userId: userId,
                isActive: true
            });

            if (!translation) {
                return {
                    success: false,
                    message: 'Translation not found',
                    statusCode: 404
                };
            }

            return {
                success: true,
                message: 'Translation retrieved successfully',
                data: translation,
                statusCode: 200
            };

        } catch (error: any) {
            console.error('Get translation error:', error);
            return {
                success: false,
                message: 'Failed to retrieve translation',
                statusCode: 500
            };
        }
    }
}

export const translationService = new TranslationService();