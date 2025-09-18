/**
 * Application constants and configuration
 * This file contains all the constants that tell the app what to do and what not to do
 */

/**
 * App configuration constants
 */
export const APP_CONFIG = {
    JWT_EXPIRY_DAYS: 7,
    MAX_TRANSLATION_LENGTH: 10000, // Updated to match your validation
    MAX_FULL_NAME_LENGTH: 50,
    MIN_FULL_NAME_LENGTH: 2,
    // OTP handling is now managed by Twilio Verify
} as const;

/**
 * Translation modes
 */
export const TRANSLATION_MODES = ['professional', 'personal', 'casual'] as const;
export type TranslationMode = typeof TRANSLATION_MODES[number];

/**
 * Phone number patterns
 */
export const PHONE_CONFIG = {
    MIN_DIGITS: 10,
    MAX_DIGITS: 15,
    US_COUNTRY_CODE: '+1'
} as const;

/**
 * Twilio Verify configuration
 */
export const TWILIO_CONFIG = {
    VERIFY_CHANNEL: 'sms',
    MAX_VERIFICATION_ATTEMPTS: 5
} as const;


/**
 * Environment configurations
 */
export const ENV_VARS = {
    REQUIRED: [
        'TWILIO_ACCOUNT_SID',
        'TWILIO_AUTH_TOKEN', 
        'TWILIO_VERIFY_SERVICE_SID',
        'JWT_SECRET',
        'JWT_REFRESH_SECRET',
        'MONGODB_URI'
    ],
    OPTIONAL: [
        'NODE_ENV',
        'PORT',
        'LOG_LEVEL'
    ]
} as const;

/**
 * HTTP status codes for consistent responses
 */
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
} as const;

/**
 * User status constants
 */
export const USER_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    DELETED: 'deleted',
    VERIFIED: 'verified',
    UNVERIFIED: 'unverified'
} as const;

/**
 * Trial status constants
 */
export const TRIAL_STATUS = {
    ACTIVE: 'active',
    EXPIRED: 'expired',
    NOT_STARTED: 'not_started'
} as const;

/**
 * API rate limiting constants
 */
export const RATE_LIMIT = {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100, // requests per window
    MESSAGE: 'Too many requests, please try again later.'
} as const;