import { Response } from 'express';

// HTTP Status Codes for consistent responses
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

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: string[];
    statusCode: number;
}

/**
 * Send success response with consistent format
 */
export const sendSuccessResponse = <T>(
    res: Response, 
    data: T, 
    message: string = 'Success',
    statusCode: number = 200
): void => {
    const response: ApiResponse<T> = {
        success: true,
        message,
        data,
        statusCode
    };
    
    res.status(statusCode).json(response);
};

/**
 * Send error response with consistent format
 */
export const sendErrorResponse = (
    res: Response,
    message: string,
    statusCode: number = 400,
    errors?: string[]
): void => {
    const response: ApiResponse = {
        success: false,
        message,
        statusCode,
        ...(errors && { errors })
    };
    
    res.status(statusCode).json(response);
};

/**
 * Send validation error response
 */
export const sendValidationError = (
    res: Response,
    errors: string[]
): void => {
    sendErrorResponse(res, 'Validation failed', HTTP_STATUS.UNPROCESSABLE_ENTITY, errors);
};

/**
 * Send not found response
 */
export const sendNotFoundResponse = (
    res: Response,
    message: string = 'Resource not found'
): void => {
    sendErrorResponse(res, message, HTTP_STATUS.NOT_FOUND);
};

/**
 * Send unauthorized response
 */
export const sendUnauthorizedResponse = (
    res: Response,
    message: string = 'Unauthorized access'
): void => {
    sendErrorResponse(res, message, HTTP_STATUS.UNAUTHORIZED);
};

/**
 * Send forbidden response
 */
export const sendForbiddenResponse = (
    res: Response,
    message: string = 'Access forbidden'
): void => {
    sendErrorResponse(res, message, HTTP_STATUS.FORBIDDEN);
};

/**
 * Send conflict response (duplicate resource)
 */
export const sendConflictResponse = (
    res: Response,
    message: string = 'Resource already exists'
): void => {
    sendErrorResponse(res, message, HTTP_STATUS.CONFLICT);
};

/**
 * Send internal server error response
 */
export const sendInternalServerError = (
    res: Response,
    message: string = 'Internal server error'
): void => {
    sendErrorResponse(res, message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
};

/**
 * Success status helpers
 */

/**
 * Send created response (201)
 */
export const sendCreatedResponse = <T>(
    res: Response,
    data: T,
    message: string = 'Created successfully'
): void => {
    sendSuccessResponse(res, data, message, HTTP_STATUS.CREATED);
};

/**
 * Send no content response (204)
 */
export const sendNoContentResponse = (
    res: Response,
    message: string = 'No content'
): void => {
    sendSuccessResponse(res, undefined, message, HTTP_STATUS.NO_CONTENT);
};

/**
 * Send updated response (200)
 */
export const sendUpdatedResponse = <T>(
    res: Response,
    data: T,
    message: string = 'Updated successfully'
): void => {
    sendSuccessResponse(res, data, message, HTTP_STATUS.OK);
};

/**
 * Send deleted response (200)
 */
export const sendDeletedResponse = (
    res: Response,
    message: string = 'Deleted successfully'
): void => {
    sendSuccessResponse(res, undefined, message, HTTP_STATUS.OK);
};