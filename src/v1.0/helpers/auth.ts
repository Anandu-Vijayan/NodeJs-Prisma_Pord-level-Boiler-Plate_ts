/**
 * Auth Helpers
 * Custom utilities used only by v1.0 auth controller
 */

import jwt from 'jsonwebtoken';
import config from '../../config/env';
import { JwtPayload } from '../../types';

/**
 * Generate JWT Token
 */
export const generateToken = (id: string): string => {
  if (!config.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: String(config.JWT_EXPIRE),
  } as jwt.SignOptions);
};

/**
 * Verify JWT Token
 */
export const verifyToken = (token: string): JwtPayload => jwt.verify(token, config.JWT_SECRET) as JwtPayload;

