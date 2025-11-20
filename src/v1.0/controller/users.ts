/**
 * Users Controller
 * Handles user management requests for v1.0
 */

import { Response } from 'express';
import { prisma } from '../../config/database';
import { createUserWithPassword } from '../models/User';
import { asyncHandler } from '../../utilities/asyncHandler';
import { sendSuccess, sendError } from '../../utilities/response';
import { AuthenticatedRequest } from '../../types/express';
import { userSelectFields, userSelectMinimal } from '../models/userSelect';

/**
 * @desc    Get all users
 * @route   GET /api/v1.0/users
 * @access  Private/Admin
 */
export const getUsers = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const users = await prisma.user.findMany({
    select: userSelectFields,
  });
  sendSuccess(res, users, 'Users retrieved successfully');
});

/**
 * @desc    Get single user
 * @route   GET /api/v1.0/users/:id
 * @access  Private
 */
export const getUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: userSelectFields,
  });

  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  sendSuccess(res, user, 'User retrieved successfully');
});

/**
 * @desc    Create user
 * @route   POST /api/v1.0/users
 * @access  Private/Admin
 */
export const createUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { password, ...userData } = req.body;
  
  if (password) {
    const user = await createUserWithPassword({
      ...userData,
      password,
    });
    sendSuccess(res, user, 'User created successfully', 201);
  } else {
    const user = await prisma.user.create({
      data: userData,
      select: userSelectFields,
    });
    sendSuccess(res, user, 'User created successfully', 201);
  }
});

/**
 * @desc    Update user
 * @route   PUT /api/v1.0/users/:id
 * @access  Private
 */
export const updateUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { password, ...updateData } = req.body;
  
  // Check if user exists (minimal select for existence check)
  const existingUser = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: userSelectMinimal,
  });

  if (!existingUser) {
    return sendError(res, 'User not found', 404);
  }

  // If password is being updated, hash it
  const dataToUpdate = password
    ? { ...updateData, password: await (await import('../models/User')).hashPassword(password) }
    : updateData;

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: dataToUpdate,
    select: userSelectFields,
  });

  sendSuccess(res, user, 'User updated successfully');
});

/**
 * @desc    Delete user
 * @route   DELETE /api/v1.0/users/:id
 * @access  Private/Admin
 */
export const deleteUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // Check if user exists (minimal select for existence check)
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: userSelectMinimal,
  });

  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  await prisma.user.delete({
    where: { id: req.params.id },
  });
  
  sendSuccess(res, null, 'User deleted successfully');
});

