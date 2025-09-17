import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/oAuth';

// Extend Express Request interface to include user data
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                phoneNumber: string;
                expiresIn: number;
            };
        }
    }
}

/**
 * Authentication middleware to verify JWT tokens
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access token required'
            });
            return;
        }

        const decoded = verifyAccessToken(token);

        if (!decoded) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
            return;
        }

        // Add user data to request object
        req.user = decoded;
        next();

    } catch (error: any) {
        console.error('Authentication middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

/**
 * Optional authentication middleware - doesn't fail if no token
 */
export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = verifyAccessToken(token);
            if (decoded) {
                req.user = decoded;
            }
        }

        next();

    } catch (error: any) {
        // Don't fail on optional auth errors
        next();
    }
};