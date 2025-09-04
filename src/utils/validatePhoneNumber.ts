// Phone validation utilities for MVP - phone auth is the primary login method
import { IUser } from "../types/userTypes";
import { ITranslation } from "../types/translationTypes";

// HTTP Status Codes for frontend responses
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500
} as const;

// Standard API response structure
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: string[];
    statusCode: number;
}


// Phone number validation
export const validatePhoneNumber = (phoneNumber: string): boolean => {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
        return false;
    }

    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
};

// Email validation
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Generate verification code (6 digits)
export const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper functions for creating API responses
export const createSuccessResponse = <T>(data: T, message: string = "Success"): ApiResponse<T> => ({
    success: true,
    message,
    data,
    statusCode: HTTP_STATUS.OK
});

export const createErrorResponse = (message: string, errors: string[] = [], statusCode: number = HTTP_STATUS.BAD_REQUEST): ApiResponse => ({
    success: false,
    message,
    errors,
    statusCode
});

export const createValidationErrorResponse = (errors: string[]): ApiResponse => ({
    success: false,
    message: "Validation failed",
    errors,
    statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY
});

// User data validation
export const validateUserData = (userData: Partial<IUser>): { 
    isValid: boolean;
    errors: string[];
} => { 
    const errors: string[] = [];
    
    if (!userData.fullName || userData.fullName.trim().length < 2) {
        errors.push("Full name is required and must be at least 2 characters long");
    }

    if (!validatePhoneNumber(userData.phoneNumber || "")) {
        errors.push("Invalid phone number");
    }

    if (userData.email && !validateEmail(userData.email)) {
        errors.push("Invalid email address");
    }
    
    return { isValid: errors.length === 0, errors };
};

// Translation data validation
export const validateTranslationData = (data: Partial<ITranslation>): { 
    isValid: boolean;
    errors: string[];
} => {
   const errors: string[] = [];
   
   if (!data.translationInput || data.translationInput.trim().length === 0) {
    errors.push("Translation input is required");
   }

   if (data.translationInput && data.translationInput.length > 10000) {
    errors.push("Translation input must be less than 10000 characters long");
   }

   if (!validateMode(data.mode || '')) {
    errors.push("Invalid mode");
   }

   return { isValid: errors.length === 0, errors };
};

// Mode validation
export const validateMode = (mode: string): mode is 'professional' | 'personal' | 'casual' => {
    const validModes: Array<'professional' | 'personal' | 'casual'> = ['professional', 'personal', 'casual'];
    return validModes.includes(mode as 'professional' | 'personal' | 'casual'); 
};