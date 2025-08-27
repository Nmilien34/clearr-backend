import { Request, Response, NextFunction } from 'express';
import { AppError, ApiResponse } from '../types';
import { Logger } from '../utils/logger';

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  Logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new CustomError(message, 404);
  }

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    const message = 'Duplicate field value entered';
    error = new CustomError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors)
      .map((val: any) => val.message)
      .join(', ');
    error = new CustomError(message, 400);
  }

  const statusCode = (error as AppError).statusCode || 500;
  const message = error.message || 'Server Error';

  const response: ApiResponse = {
    success: false,
    error: message,
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    (response as any).stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new CustomError(`Route not found - ${req.originalUrl}`, 404);
  next(error);
};
