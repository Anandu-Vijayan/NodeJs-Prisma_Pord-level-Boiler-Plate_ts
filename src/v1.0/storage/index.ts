/**
 * Storage Module
 * Centralized file/image storage logic and middleware
 */

import {
  uploadSingle,
  uploadMultiple,
  uploadFields,
  handleMulterError,
} from '../../utilities/fileUpload';
import * as cloudinaryService from './cloudinary';

export {
  uploadSingle,
  uploadMultiple,
  uploadFields,
  handleMulterError,
  cloudinaryService,
};

