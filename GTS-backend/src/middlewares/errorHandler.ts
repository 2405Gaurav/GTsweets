import { Request, Response, NextFunction } from 'express';

// Async handler to wrap async route handlers
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      // Handle errors thrown in async functions
      const statusCode = (error as any).statusCode || 500;
      
      res.status(statusCode).json({
        error: error.message || 'Internal server error',
      });
    });
  };
};

// Global error handler middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};