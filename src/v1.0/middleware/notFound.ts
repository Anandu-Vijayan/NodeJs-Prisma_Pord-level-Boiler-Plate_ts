import { Request, Response, NextFunction } from 'express';

/**
 * 404 Not Found middleware
 */
const notFound = (req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

export default notFound;

