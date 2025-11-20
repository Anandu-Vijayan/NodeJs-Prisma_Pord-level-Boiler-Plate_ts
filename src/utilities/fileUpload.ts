import multer, { FileFilterCallback, MulterError } from 'multer';
import { Request, Response, NextFunction } from 'express';
import config from '../config/env';
import { BadRequestError } from './errors';

/**
 * File filter for multer
 */
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  // Check if file type is allowed
  if (config.ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        `Invalid file type. Allowed types: ${config.ALLOWED_FILE_TYPES.join(', ')}`,
      ) as any,
      false,
    );
  }
};

/**
 * Multer configuration
 * Using memory storage for Cloudinary upload
 */
const storage = multer.memoryStorage();

/**
 * Multer upload configuration
 */
const upload = multer({
  storage,
  limits: {
    fileSize: config.MAX_FILE_SIZE,
  },
  fileFilter,
});

/**
 * Single file upload middleware
 */
export const uploadSingle = (fieldName = 'file') => upload.single(fieldName);

/**
 * Multiple files upload middleware
 */
export const uploadMultiple = (fieldName = 'files', maxCount = 10) => upload.array(fieldName, maxCount);

/**
 * Multiple fields upload middleware
 */
export const uploadFields = (fields: multer.Field[]) => upload.fields(fields);

/**
 * Error handler for multer errors
 */
export const handleMulterError = (
  err: Error | MulterError,
  _req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new BadRequestError(`File too large. Maximum size: ${config.MAX_FILE_SIZE / 1024 / 1024}MB`));
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(new BadRequestError('Too many files'));
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new BadRequestError('Unexpected file field'));
    }
    return next(new BadRequestError(err.message));
  }
  next(err);
};

export { upload };

