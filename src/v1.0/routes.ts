/**
 * v1.0 Routes
 * Endpoint mapping for API version 1.0
 */

import express, { Request, Response } from 'express';
import { protect, authorize } from './middleware/auth';
import { uploadSingle, uploadMultiple, handleMulterError } from './storage';
import { validate, rules } from './helpers/validation';

// Import controllers
import * as uploadsController from './controller/uploads';
import * as authController from './controller/auth';
import * as usersController from './controller/users';

const router = express.Router();

/**
 * @swagger
 * /api/v1.0:
 *   get:
 *     summary: Get API v1.0 information
 *     tags: [API v1.0]
 *     responses:
 *       200:
 *         description: API v1.0 information
 */
router.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API v1.0 is working',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      uploads: '/api/v1.0/uploads',
      auth: '/api/v1.0/auth',
      users: '/api/v1.0/users',
    },
  });
});

// ==================== UPLOADS ROUTES ====================

/**
 * @swagger
 * /api/v1.0/uploads:
 *   post:
 *     summary: Upload a single file (v1.0)
 *     tags: [Uploads v1.0]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/uploads',
  protect,
  uploadSingle('file'),
  handleMulterError,
  uploadsController.uploadSingle,
);

/**
 * @swagger
 * /api/v1.0/uploads/multiple:
 *   post:
 *     summary: Upload multiple files (v1.0)
 *     tags: [Uploads v1.0]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/uploads/multiple',
  protect,
  uploadMultiple('files', 10),
  handleMulterError,
  uploadsController.uploadMultiple,
);

/**
 * @swagger
 * /api/v1.0/uploads/{publicId}:
 *   delete:
 *     summary: Delete a file (v1.0)
 *     tags: [Uploads v1.0]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/uploads/:publicId', protect, uploadsController.deleteFile);

/**
 * @swagger
 * /api/v1.0/uploads/multiple:
 *   delete:
 *     summary: Delete multiple files (v1.0)
 *     tags: [Uploads v1.0]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/uploads/multiple', protect, uploadsController.deleteMultiple);

/**
 * @swagger
 * /api/v1.0/uploads/transform/{publicId}:
 *   get:
 *     summary: Get transformed image URL (v1.0)
 *     tags: [Uploads v1.0]
 */
router.get('/uploads/transform/:publicId', uploadsController.getTransformedUrl);

// ==================== AUTH ROUTES ====================

/**
 * @swagger
 * /api/v1.0/auth/register:
 *   post:
 *     summary: Register a new user (v1.0)
 *     tags: [Auth v1.0]
 */
router.post(
  '/auth/register',
  rules.name(),
  rules.email(),
  rules.password(),
  validate,
  authController.register,
);

/**
 * @swagger
 * /api/v1.0/auth/login:
 *   post:
 *     summary: Login user (v1.0)
 *     tags: [Auth v1.0]
 */
router.post(
  '/auth/login',
  rules.email(),
  rules.password('password', 6),
  validate,
  authController.login,
);

/**
 * @swagger
 * /api/v1.0/auth/me:
 *   get:
 *     summary: Get current user (v1.0)
 *     tags: [Auth v1.0]
 *     security:
 *       - bearerAuth: []
 */
router.get('/auth/me', protect, authController.getMe);

/**
 * @swagger
 * /api/v1.0/auth/logout:
 *   post:
 *     summary: Logout user (v1.0)
 *     tags: [Auth v1.0]
 *     security:
 *       - bearerAuth: []
 */
router.post('/auth/logout', protect, authController.logout);

// ==================== USERS ROUTES ====================

/**
 * @swagger
 * /api/v1.0/users:
 *   get:
 *     summary: Get all users (v1.0)
 *     tags: [Users v1.0]
 *     security:
 *       - bearerAuth: []
 */
router.get('/users', protect, authorize('admin'), usersController.getUsers);

/**
 * @swagger
 * /api/v1.0/users/{id}:
 *   get:
 *     summary: Get single user (v1.0)
 *     tags: [Users v1.0]
 *     security:
 *       - bearerAuth: []
 */
router.get('/users/:id', protect, rules.mongoId('id'), validate, usersController.getUser);

/**
 * @swagger
 * /api/v1.0/users:
 *   post:
 *     summary: Create user (v1.0)
 *     tags: [Users v1.0]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/users',
  protect,
  authorize('admin'),
  rules.name(),
  rules.email(),
  rules.password(),
  validate,
  usersController.createUser,
);

/**
 * @swagger
 * /api/v1.0/users/{id}:
 *   put:
 *     summary: Update user (v1.0)
 *     tags: [Users v1.0]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  '/users/:id',
  protect,
  rules.mongoId('id'),
  validate,
  usersController.updateUser,
);

/**
 * @swagger
 * /api/v1.0/users/{id}:
 *   delete:
 *     summary: Delete user (v1.0)
 *     tags: [Users v1.0]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  '/users/:id',
  protect,
  authorize('admin'),
  rules.mongoId('id'),
  validate,
  usersController.deleteUser,
);

export default router;

