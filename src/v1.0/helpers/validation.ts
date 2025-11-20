/**
 * Validation Helpers
 * Custom validation utilities for v1.0
 */

import {
  body, param, query, ValidationChain,
} from 'express-validator';
import { validate as baseValidate, validationRules as baseRules } from '../../utilities/validation';

/**
 * Common validation rules
 */
export const rules = {
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

export { baseValidate as validate, baseRules };

