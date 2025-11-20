import {
  body, param, query, validationResult, ValidationChain,
} from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './errors';

/**
 * Validation middleware - Check for validation errors
 */
export const validate = (req: Request, _res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.type === 'field' ? error.path : (error as any).param,
      message: error.msg,
      value: (error as any).value,
    }));

    throw new ValidationError('Validation failed', errorMessages);
  }

  next();
};

/**
 * Common validation rules
 */
export const validationRules = {
  // MongoDB ObjectId validation
  mongoId: (field = 'id'): ValidationChain => param(field)
    .isMongoId()
    .withMessage(`Invalid ${field} format`),

  // Email validation
  email: (field = 'email'): ValidationChain => body(field)
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  // Password validation
  password: (field = 'password', minLength = 6): ValidationChain => body(field)
    .isLength({ min: minLength })
    .withMessage(`Password must be at least ${minLength} characters`)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  // Name validation
  name: (field = 'name', minLength = 2, maxLength = 50): ValidationChain => body(field)
    .trim()
    .isLength({ min: minLength, max: maxLength })
    .withMessage(`${field} must be between ${minLength} and ${maxLength} characters`),

  // Pagination validation
  pagination: (): ValidationChain[] => [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],
};

