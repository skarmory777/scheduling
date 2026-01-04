import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', error);

  const statusCode = getStatusCode(error);
  const message = getErrorMessage(error);

  res.status(statusCode).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
}

function getStatusCode(error: Error): number {
  const message = error.message.toLowerCase();

  if (message.includes('not found')) {
    return 404;
  }
  
  if (message.includes('invalid') || message.includes('credentials')) {
    return 401;
  }
  
  if (message.includes('already exists')) {
    return 409;
  }
  
  if (message.includes('validation') || message.includes('required')) {
    return 400;
  }

  return 500;
}

function getErrorMessage(error: Error): string {
  return process.env.NODE_ENV === 'production'
    ? 'An unexpected error occurred'
    : error.message;
}