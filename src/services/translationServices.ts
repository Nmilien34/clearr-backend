// services/translation.service.ts
import Translation from '../models/translationModels';
import User from '../models/userModels';
import { ITranslation } from '../types/translationTypes';
import { validateTranslation } from '../utils/validateTranslation';
import { getTranslationPrompt, shouldBlockContent } from '../utils/translationPrompts';
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
            mode: 'professional' | 'personal' | 'casual';
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
            // Validate input data
            const validation = validateTranslation(translationData);
            if (!validation.isValid) {
                return {
                    success: false,
                    message: validation.error || 'Validation failed',
                    statusCode: 400
                };
            }

            // Use validated data
            const validatedData = validation.data!;

            // Get user for context
            const user = await User.findById(userId);
            if (!user || !user.isActive) {
                return {
                    success: false,
                    message: 'User not found or inactive',
                    statusCode: 404
                };
            }

            // Check for harmful content (only extreme cases)
            if (shouldBlockContent(validatedData.translationInput)) {
                return {
                    success: false,
                    message: 'Cannot process this type of content',
                    statusCode: 400
                };
            }

            // Generate translation using OpenAI
            const translationOutput = await this.processWithOpenAI(
                validatedData.translationInput,
                validatedData.mode,
                user.contextTraining
            );

            // Save translation to database
            const translation = new Translation({
                userId: user._id,
                mode: validatedData.mode,
                translationInput: validatedData.translationInput,
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
        mode: 'professional' | 'personal' | 'casual',
        context?: string[]
    ): Promise<string[]> {
        try {
            const prompt = getTranslationPrompt(input, mode, context);

            const response = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 150,
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
}

export const translationService = new TranslationService();