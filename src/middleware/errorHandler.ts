import type { Request, Response, NextFunction } from 'express';
import z from 'zod';

interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {

   if (response.headersSent) return next(error);
  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    const details = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return response.status(400).json({
      error: {
        status: 400,
        message: "Validation failed",
        details,
      },
    });
  }

  // Handle regular errors
  const status = error.status || 500;
  const message = error.message || 'Server Error';

  response.status(status).json({
    success: false,
    error: message,
  });
};
