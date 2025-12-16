import type { Request, Response, NextFunction } from 'express';
import z from 'zod';


export const errorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {

   if (response.headersSent) return next(error);
  // Handle Zod validation errors
  
  if (error instanceof z.ZodError) {
  return response.status(400).json({
    success: false,
    error: error.issues[0].message,
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
