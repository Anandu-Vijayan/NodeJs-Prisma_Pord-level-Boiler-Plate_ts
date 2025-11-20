/**
 * Uploads Controller
 * Handles file upload requests for v1.0
 */

import { Response } from 'express';
import { asyncHandler } from '../../utilities/asyncHandler';
import { sendSuccess } from '../../utilities/response';
import { BadRequestError } from '../../utilities/errors';
import logger from '../../utilities/logger';
import { cloudinaryService } from '../storage';
import { AuthenticatedRequest } from '../../types/express';

/**
 * @desc    Upload single file
 * @route   POST /api/v1.0/uploads
 * @access  Private
 */
export const uploadSingle = asyncHandler(async (req: AuthenticatedRequest & { file?: Express.Multer.File; id?: string }, res: Response) => {
  if (!req.file) {
    throw new BadRequestError('No file provided');
  }

  try {
    // Upload to Cloudinary
    const result = await cloudinaryService.uploadBuffer(req.file.buffer, {
      folder: req.body.folder || 'uploads',
      publicId: req.body.publicId,
    });

    const fileData = {
      publicId: result.public_id,
      url: cloudinaryService.getFileUrl(result),
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      createdAt: result.created_at,
    };

    logger.info('File uploaded successfully', {
      publicId: result.public_id,
      requestId: req.id,
    });

    sendSuccess(res, fileData, 'File uploaded successfully', 201);
  } catch (error) {
    const err = error as Error;
    logger.error('File upload error', {
      error: err.message,
      requestId: req.id,
    });
    throw error;
  }
});

/**
 * @desc    Upload multiple files
 * @route   POST /api/v1.0/uploads/multiple
 * @access  Private
 */
export const uploadMultiple = asyncHandler(async (req: AuthenticatedRequest & { files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] }; id?: string }, res: Response) => {
  const files = Array.isArray(req.files) ? req.files : undefined;
  if (!files || files.length === 0) {
    throw new BadRequestError('No files provided');
  }

  try {
    // Convert files to buffers
    const buffers = files.map((file) => file.buffer);

    // Upload to Cloudinary
    const results = await cloudinaryService.uploadMultipleBuffers(buffers, {
      folder: req.body.folder || 'uploads',
      publicId: req.body.publicId,
    });

    const filesData = results.map((result) => ({
      publicId: result.public_id,
      url: cloudinaryService.getFileUrl(result),
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      createdAt: result.created_at,
    }));

    logger.info('Multiple files uploaded successfully', {
      count: filesData.length,
      requestId: req.id,
    });

    sendSuccess(res, { files: filesData, count: filesData.length }, 'Files uploaded successfully', 201);
  } catch (error) {
    const err = error as Error;
    logger.error('Multiple file upload error', {
      error: err.message,
      requestId: req.id,
    });
    throw error;
  }
});

/**
 * @desc    Delete file
 * @route   DELETE /api/v1.0/uploads/:publicId
 * @access  Private
 */
export const deleteFile = asyncHandler(async (req: AuthenticatedRequest & { id?: string }, res: Response) => {
  const { publicId } = req.params;

  if (!publicId) {
    throw new BadRequestError('Public ID is required');
  }

  try {
    const result = await cloudinaryService.deleteFile(publicId);

    logger.info('File deleted successfully', {
      publicId,
      requestId: req.id,
    });

    sendSuccess(res, result, 'File deleted successfully');
  } catch (error) {
    const err = error as Error;
    logger.error('File deletion error', {
      error: err.message,
      publicId,
      requestId: req.id,
    });
    throw error;
  }
});

/**
 * @desc    Delete multiple files
 * @route   DELETE /api/v1.0/uploads/multiple
 * @access  Private
 */
export const deleteMultiple = asyncHandler(async (req: AuthenticatedRequest & { id?: string }, res: Response) => {
  const { publicIds } = req.body;

  if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
    throw new BadRequestError('Public IDs array is required');
  }

  try {
    const result = await cloudinaryService.deleteMultipleFiles(publicIds);

    logger.info('Multiple files deleted successfully', {
      count: publicIds.length,
      requestId: req.id,
    });

    sendSuccess(res, result, 'Files deleted successfully');
  } catch (error) {
    const err = error as Error;
    logger.error('Multiple file deletion error', {
      error: err.message,
      requestId: req.id,
    });
    throw error;
  }
});

/**
 * @desc    Get transformed image URL
 * @route   GET /api/v1.0/uploads/transform/:publicId
 * @access  Public
 */
export const getTransformedUrl = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { publicId } = req.params;
  const {
    width, height, crop, quality, format,
  } = req.query;

  if (!publicId) {
    throw new BadRequestError('Public ID is required');
  }

  const transformations: any[] = [];

  if (width || height) {
    transformations.push({
      width: width ? parseInt(width as string, 10) : undefined,
      height: height ? parseInt(height as string, 10) : undefined,
      crop: crop || 'limit',
    });
  }

  if (quality) {
    transformations.push({
      quality: quality || 'auto',
    });
  }

  if (format) {
    transformations.push({
      format,
    });
  }

  const transformedUrl = cloudinaryService.getTransformedUrl(publicId, transformations);

  sendSuccess(res, { url: transformedUrl, publicId }, 'Transformed URL generated');
});

