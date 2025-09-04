import jwt from 'jsonwebtoken';
import twilio from 'twilio';

const twilioClient = twilio(
    process.env['TWILIO_ACCOUNT_SID']!,
    process.env['TWILIO_AUTH_TOKEN']!
);

/**
 * Normalize phone number to E.164 format
 */
export const normalizePhoneNumber = (phoneNumber: string): string => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
        return `+1${cleaned}`;
    }
    
    return `+${cleaned}`;
};

/**
 * Send OTP using Twilio Verify (replaces manual SMS)
 */
export const sendVerificationOTP = async (phoneNumber: string): Promise<{
    success: boolean;
    message: string;
    statusCode: number;
}> => {
    try {
        await twilioClient.verify.v2
            .services(process.env['TWILIO_VERIFY_SERVICE_SID']!)
            .verifications
            .create({
                to: normalizePhoneNumber(phoneNumber),
                channel: 'sms'
            });

        return {
            success: true,
            message: 'Verification code sent successfully',
            statusCode: 200
        };

    } catch (error: any) {
        console.error('Twilio Verify error:', error);
        return {
            success: false,
            message: 'Failed to send verification code',
            statusCode: 500
        };
    }
};

/**
 * Verify OTP using Twilio Verify (replaces manual verification)
 */
export const verifyOTP = async (phoneNumber: string, code: string): Promise<{
    success: boolean;
    message: string;
    statusCode: number;
}> => {
    try {
        const verificationCheck = await twilioClient.verify.v2
            .services(process.env['TWILIO_VERIFY_SERVICE_SID']!)
            .verificationChecks
            .create({
                to: normalizePhoneNumber(phoneNumber),
                code: code
            });

        if (verificationCheck.status === 'approved') {
            return {
                success: true,
                message: 'Phone number verified successfully',
                statusCode: 200
            };
        } else {
            return {
                success: false,
                message: 'Invalid or expired verification code',
                statusCode: 400
            };
        }

    } catch (error: any) {
        console.error('Twilio Verify error:', error);
        return {
            success: false,
            message: 'Verification failed',
            statusCode: 400
        };
    }
};

/**
 * Generate JWT token after successful verification
 */
export const generateAccessToken = (userId: string, phoneNumber: string): string => {
    const payload = {
        userId,
        phoneNumber: normalizePhoneNumber(phoneNumber),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days expiration
    };
    
    return jwt.sign(payload, process.env['JWT_SECRET']!, { expiresIn: '7d' });
};

/**
 * Verify JWT token
 */
export const verifyAccessToken = (token: string): { userId: string; phoneNumber: string; expiresIn: number } | null => {
    try {
        const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as any;
        return { 
            userId: decoded.userId,
            phoneNumber: decoded.phoneNumber,
            expiresIn: decoded.exp
        };
    } catch (error: any) {
        return null;
    }
};

/**
 * Generate refresh token (30 days)
 */
export const generateRefreshToken = (userId: string): string => {
    return jwt.sign(
        { userId, type: 'refresh' }, 
        process.env['JWT_REFRESH_SECRET']!, 
        { expiresIn: '30d' }
    );
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): { userId: string } | null => {
    try {
        const decoded = jwt.verify(token, process.env['JWT_REFRESH_SECRET']!) as any;
        return { userId: decoded.userId };
    } catch (error: any) {
        return null;
    }
};

/**
 * Token blacklisting for secure logout (placeholder - implement with Redis/database)
 */
export const blacklistToken = (token: string): void => {
    // TODO: Add token to Redis or database blacklist
    // This prevents using the token even if it hasn't expired
    console.log(`Token blacklisted: ${token.substring(0, 20)}...`);
};

/**
 * Check if token is blacklisted (placeholder)
 */
export const isTokenBlacklisted = (token: string): boolean => {
    // TODO: Check if token exists in Redis or database blacklist
    return false; // Placeholder - implement actual check
};