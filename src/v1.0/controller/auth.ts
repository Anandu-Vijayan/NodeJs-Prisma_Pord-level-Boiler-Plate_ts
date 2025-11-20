/**
 * Auth Controller
 * Handles authentication requests for v1.0
 */

import { Response } from 'express';
import { prisma } from '../../config/database';
import { createUserWithPassword, comparePassword } from '../models/User';
import { asyncHandler } from '../../utilities/asyncHandler';
import { sendSuccess } from '../../utilities/response';
import { BadRequestError, UnauthorizedError } from '../../utilities/errors';
import { generateToken } from '../helpers/auth';
import config from '../../config/env';
import { AuthenticatedRequest } from '../../types/express';

/**
 * @desc    Register user
 * @route   POST /api/v1.0/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const userExists = await prisma.user.findUnique({
    where: { email },
  });
  
  if (userExists) {
    throw new BadRequestError('User already exists with this email');
  }

  // Create user
  const user = await createUserWithPassword({
    name,
    email,
    password,
    role: 'user',
    isActive: true,
  });

  // Generate token
  const token = generateToken(user.id);

  // Send token in cookie
  const cookieOptions = {
    expires: new Date(Date.now() + config.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };

  res.cookie('token', token, cookieOptions);

  sendSuccess(res, { user, token }, 'User registered successfully', 201);
});

/**
 * @desc    Login user
 * @route   POST /api/v1.0/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  // Check for user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Check if password matches
  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new UnauthorizedError('Invalid credentials');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('User account is inactive');
  }

  // Generate token
  const token = generateToken(user.id);

  // Send token in cookie
  const cookieOptions = {
    expires: new Date(Date.now() + config.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };

  res.cookie('token', token, cookieOptions);

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  sendSuccess(res, { user: userWithoutPassword, token }, 'User logged in successfully');
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/v1.0/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  sendSuccess(res, user, 'User retrieved successfully');
});

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/v1.0/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  sendSuccess(res, null, 'User logged out successfully');
});

