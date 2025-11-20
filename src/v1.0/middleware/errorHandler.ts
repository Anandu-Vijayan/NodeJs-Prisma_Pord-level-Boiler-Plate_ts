import { Request, Response, NextFunction } from 'express';
import logger from '../../utilities/logger';
import { sendError } from '../../utilities/response';
import config from '../../config/env';
import { AppError } from '../../utilities/errors';

interface ExtendedRequest extends Request {
  id?: string;
}

/**
 * Error handling middleware
 */
const errorHandler = (
  err: Error | AppError | any,
  req: ExtendedRequest,
  res: Response,
  _next: NextFunction,
): void => {
  let error: any = { ...err };
  error.message = err.message;

  // Log error with request ID
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    requestId: req.id,
    url: req.originalUrl,
    method: req.method,
  });

  // Handle custom AppError
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  // CastError (invalid ObjectId) - typically from MongoDB/Mongoose
  if (err.name === 'CastError') {
    return sendError(res, 'Resource not found', 404);
  }

  // MongoDB duplicate key error (code 11000)
  if (err.code === 11000) {
    return sendError(res, 'Duplicate field value entered', 400);
  }

  // Prisma errors
  // P2002: Unique constraint violation (duplicate key)
  if (err.code === 'P2002') {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // P2025: Record not found
  if (err.code === 'P2025') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // P2003: Foreign key constraint violation
  if (err.code === 'P2003') {
    const message = 'Invalid reference to related record';
    error = { message, statusCode: 400 };
  }

  // Prisma validation errors
  if (err.name === 'PrismaClientValidationError') {
    const message = 'Invalid data provided';
    error = { message, statusCode: 400 };
  }

  // Prisma known request error
  if (err.name === 'PrismaClientKnownRequestError') {
    const message = err.meta?.cause || 'Database operation failed';
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  // Express validator errors (err.errors is an array)
  if (err.name === 'ValidationError' && Array.isArray(err.errors)) {
    const message = 'Validation failed';
    const errors = err.errors.map((e: any) => ({
      field: e.param,
      message: e.msg,
    }));
    return sendError(res, message, 400, errors);
  }

  // Mongoose/other ValidationError with errors object
  if (err.name === 'ValidationError' && err.errors && typeof err.errors === 'object') {
    const errorMessages = Object.values(err.errors as Record<string, any>)
      .map((e: any) => e.message || e.msg)
      .join(', ');
    return sendError(res, errorMessages, 400);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Don't leak error details in production
  const errorDetails = config.NODE_ENV === 'development' ? err.stack : undefined;

  sendError(res, message, statusCode, errorDetails ? { stack: errorDetails } : undefined);
};

export default errorHandler;

