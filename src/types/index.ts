// Common API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error types
export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// User types (example)
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Request types
export interface AuthenticatedRequest extends Express.Request {
  user?: User;
}

// Environment variables type
export interface EnvironmentVariables {
  PORT: string;
  NODE_ENV: string;
  DATABASE_URL?: string;
  JWT_SECRET?: string;
  JWT_EXPIRES_IN?: string;
  API_PREFIX?: string;
  CORS_ORIGIN?: string;
}
