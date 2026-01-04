import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  if (error.message) {
    return res.status(400).json({
      error: error.message
    });
  }

  return res.status(500).json({
    error: 'Erro interno do servidor'
  });
};
