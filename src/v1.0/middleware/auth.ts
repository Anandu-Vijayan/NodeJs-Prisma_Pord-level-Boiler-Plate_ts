import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config/env';
import { prisma } from '../../config/database';
import { asyncHandler } from '../../utilities/asyncHandler';
import { sendError } from '../../utilities/response';
import { AuthenticatedRequest } from '../../types/express';
import { userSelectFields } from '../models/userSelect';

/**
 * Protect routes - Verify JWT token
 */
export const protect = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    [, token] = req.headers.authorization.split(' ');
  } else if (req.cookies.token) {
    // Check for token in cookies
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return sendError(res, 'Not authorized to access this route', 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };

    // Get user from token (exclude password)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: userSelectFields,
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    req.user = user;

    if (!req.user.isActive) {
      return sendError(res, 'User account is inactive', 401);
    }

    next();
  } catch (error) {
    return sendError(res, 'Not authorized to access this route', 401);
  }
});

/**
 * Grant access to specific roles
 */
export const authorize = (...roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    return sendError(res, 'User not authenticated', 401);
  }

  if (!roles.includes(req.user.role)) {
    return sendError(
      res,
      `User role '${req.user.role}' is not authorized to access this route`,
      403,
    );
  }

  next();
};

