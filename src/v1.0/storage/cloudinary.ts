/**
 * Cloudinary Storage Service
 * Handles all Cloudinary operations for file storage
 */

import { Readable } from 'stream';
import cloudinary from '../../config/cloudinary';
import config from '../../config/env';
import logger from '../../utilities/logger';
import { InternalServerError } from '../../utilities/errors';
import { CloudinaryUploadResult } from '../../types';

interface UploadOptions {
  folder?: string;
  resourceType?: string;
  transformation?: any[];
  publicId?: string;
  [key: string]: any;
}

/**
 * Upload buffer to Cloudinary
 */
export const uploadBuffer = async (
  buffer: Buffer,
  options: UploadOptions = {},
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || config.CLOUDINARY_FOLDER,
      resource_type: options.resourceType || 'auto',
      transformation: options.transformation || [],
      ...options,
    };

    // Remove undefined values
    const cleanedOptions = Object.fromEntries(
      Object.entries(uploadOptions).filter(([, value]) => value !== undefined),
    );

    const uploadStream = cloudinary.uploader.upload_stream(
      cleanedOptions,
      (error, result) => {
        if (error) {
          logger.error('Cloudinary upload error', { error: error.message });
          reject(new InternalServerError('File upload failed'));
        } else if (result) {
          resolve(result as CloudinaryUploadResult);
        } else {
          reject(new InternalServerError('File upload failed'));
        }
      },
    );

    // Convert buffer to stream
    const stream = Readable.from(buffer);
    stream.pipe(uploadStream);
  });
};

/**
 * Upload multiple files to Cloudinary
 */
export const uploadMultipleBuffers = async (
  buffers: Buffer[],
  options: UploadOptions = {},
): Promise<CloudinaryUploadResult[]> => {
  const uploadPromises = buffers.map((buffer, index) => {
    const fileOptions = {
      ...options,
      publicId: options.publicId
        ? `${options.publicId}_${index}`
        : undefined,
    };
    return uploadBuffer(buffer, fileOptions);
  });

  return Promise.all(uploadPromises);
};

/**
 * Delete file from Cloudinary
 */
export const deleteFile = async (publicId: string): Promise<any> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    const err = error as Error;
    logger.error('Cloudinary delete error', { error: err.message, publicId });
    throw new InternalServerError('File deletion failed');
  }
};

/**
 * Delete multiple files from Cloudinary
 */
export const deleteMultipleFiles = async (publicIds: string[]): Promise<any> => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    const err = error as Error;
    logger.error('Cloudinary bulk delete error', { error: err.message });
    throw new InternalServerError('File deletion failed');
  }
};

/**
 * Get file URL from Cloudinary result
 */
export const getFileUrl = (result: CloudinaryUploadResult): string => result.secure_url || result.url;

/**
 * Transform image URL
 */
export const getTransformedUrl = (publicId: string, transformations: any[] = []): string => cloudinary.url(publicId, {
  transformation: transformations,
  secure: true,
});

