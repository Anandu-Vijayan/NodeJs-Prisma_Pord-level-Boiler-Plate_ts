import { Request } from 'express';
import { User } from '@prisma/client';

/**
 * Extended Express Request interface
 * Adds custom properties to the Express Request object
 */
export interface AuthenticatedRequest extends Request {
  user?: Omit<User, 'password'>;
  id?: string;
}

