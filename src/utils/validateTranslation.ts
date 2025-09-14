export interface TranslationRequest {
    translationInput: string;
    mode: 'professional' | 'personal' | 'casual';
}

export interface ValidationResult {
    isValid: boolean;
    data?: TranslationRequest;
    error?: string;
}

export const validateTranslation = (data: any): ValidationResult => {
    try {
        if (!data || typeof data !== 'object') {
            return {
                isValid: false,
                error: 'Invalid translation data'
            };
        }

        if (!data.translationInput || typeof data.translationInput !== 'string') {
            return {
                isValid: false,
                error: 'Translation input is required and must be a string'
            };
        }

        if (!data.mode || !['professional', 'personal', 'casual'].includes(data.mode)) {
            return {
                isValid: false,
                error: 'Mode is required and must be one of: professional, personal, casual'
            };
        }

        if (data.translationInput.trim().length === 0) {
            return {
                isValid: false,
                error: 'Translation input cannot be empty'
            };
        }

        return {
            isValid: true,
            data: {
                translationInput: data.translationInput.trim(),
                mode: data.mode
            }
        };
    } catch (error: any) {
        return {
            isValid: false,
            error: error.message || 'Validation failed'
        };
    }
};