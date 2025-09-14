// services/auth.service.ts
import User from '../models/userModels';
import { IUser } from '../types/userTypes';
import { 
    normalizePhoneNumber, 
    sendVerificationOTP, 
    verifyOTP, 
    generateAccessToken 
} from '../utils/oAuth';
import { validateUserData, validatePhoneNumber } from '../utils/validatePhoneNumber';

export class AuthService {
    
    /**
     * Send OTP to phone number for verification
     */
    async sendOTP(phoneNumber: string): Promise<{
        success: boolean;
        message: string;
        statusCode: number;
    }> {
        try {
            // Validate phone number format
            if (!validatePhoneNumber(phoneNumber)) {
                return {
                    success: false,
                    message: 'Invalid phone number format',
                    statusCode: 400
                };
            }

            const normalizedPhone = normalizePhoneNumber(phoneNumber);
            
            // Send OTP via Twilio Verify
            const otpResult = await sendVerificationOTP(normalizedPhone);
            
            return otpResult;

        } catch (error: any) {
            console.error('Send OTP error:', error);
            return {
                success: false,
                message: 'Failed to send verification code',
                statusCode: 500
            };
        }
    }

    /**
     * Verify OTP and login/signup user
     */
    async verifyOTPAndAuth(phoneNumber: string, otpCode: string, userData?: {
        fullName?: string;
        email?: string;
    }): Promise<{
        success: boolean;
        message: string;
        data?: {
            user: IUser;
            token: string;
            isNewUser: boolean;
        };
        statusCode: number;
    }> {
        try {
            const normalizedPhone = normalizePhoneNumber(phoneNumber);

            // Verify OTP with Twilio
            const verificationResult = await verifyOTP(normalizedPhone, otpCode);
            
            if (!verificationResult.success) {
                return verificationResult;
            }

            // Check if user exists
            let user = await User.findOne({ phoneNumber: normalizedPhone });
            let isNewUser = false;

            if (!user) {
                // New user signup - require additional data
                if (!userData?.fullName) {
                    return {
                        success: false,
                        message: 'Full name required for new account',
                        statusCode: 400
                    };
                }

                // Validate user data
                const validation = validateUserData({
                    fullName: userData.fullName,
                    phoneNumber: normalizedPhone,
                    ...(userData.email && { email: userData.email })
                });

                if (!validation.isValid) {
                    return {
                        success: false,
                        message: 'Validation failed',
                        statusCode: 400
                    };
                }

                // Create new user
                user = new User({
                    fullName: userData.fullName,
                    phoneNumber: normalizedPhone,
                    email: userData.email,
                    isVerified: true // Phone is verified
                });

                await user.save();
                isNewUser = true;
            }

            // Generate JWT token
            const token = generateAccessToken(user._id.toString(), normalizedPhone);

            return {
                success: true,
                message: isNewUser ? 'Account created successfully' : 'Login successful',
                data: {
                    user,
                    token,
                    isNewUser
                },
                statusCode: isNewUser ? 201 : 200
            };

        } catch (error: any) {
            console.error('Verify OTP error:', error);
            return {
                success: false,
                message: 'Authentication failed',
                statusCode: 500
            };
        }
    }

    /**
     * Get user by phone number
     */
    async getUserByPhone(phoneNumber: string): Promise<IUser | null> {
        try {
            const normalizedPhone = normalizePhoneNumber(phoneNumber);
            return await User.findOne({ phoneNumber: normalizedPhone, isActive: true });
        } catch (error) {
            console.error('Get user by phone error:', error);
            return null;
        }
    }

    /**
     * Check if phone number is already registered
     */
    async phoneExists(phoneNumber: string): Promise<boolean> {
        try {
            const normalizedPhone = normalizePhoneNumber(phoneNumber);
            const user = await User.findOne({ phoneNumber: normalizedPhone });
            return !!user;
        } catch (error) {
            return false;
        }
    }
}

export const authService = new AuthService();