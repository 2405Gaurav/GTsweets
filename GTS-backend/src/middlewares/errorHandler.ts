import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${statusCode}: ${message}`);

  if (err.name === 'ValidationError') {
    res.status(400).json({ error: 'Validation error', details: message });
  } else if (err.name === 'CastError') {
    res.status(400).json({ error: 'Invalid ID format' });
  } else if (err.name === 'MongoServerError' && 'code' in err && err.code === 11000) {
    res.status(409).json({ error: 'Duplicate entry' });
  } else {
    res.status(statusCode).json({ error: message });
  }
};

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
