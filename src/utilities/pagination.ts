import { Request, Response } from 'express';

interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PaginationOptionsInternal {
  defaultLimit?: number;
  maxLimit?: number;
}

/**
 * Get pagination parameters from request
 */
export const getPaginationParams = (
  req: Request,
  options: PaginationOptionsInternal = {},
): PaginationParams => {
  const {
    defaultLimit = 10,
    maxLimit = 100,
  } = options;

  const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
  const limit = Math.min(maxLimit, Math.max(1, parseInt(req.query.limit as string || String(defaultLimit), 10)));
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

/**
 * Create pagination metadata
 */
export const getPaginationMeta = (
  { page, limit }: { page: number; limit: number },
  total: number,
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};

/**
 * Create paginated response
 */
export const sendPaginatedResponse = <T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  message = 'Success',
): void => {
  res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};

