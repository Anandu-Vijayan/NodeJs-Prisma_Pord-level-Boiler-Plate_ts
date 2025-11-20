import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

interface ExtendedRequest extends Request {
  id?: string;
}

/**
 * Add request ID to each request for tracing
 */
const requestId = (req: ExtendedRequest, res: Response, next: NextFunction): void => {
  // Generate or use existing request ID
  req.id = (req.headers['x-request-id'] as string) || uuidv4();

  // Set response header
  res.setHeader('X-Request-ID', req.id);

  next();
};

export default requestId;

