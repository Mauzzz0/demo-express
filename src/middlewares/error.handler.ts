import { NextFunction, Request, Response } from 'express';
import logger from '../logger';

export const ErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);

  const status = err?.code ?? 500;

  res.status(status).json({
    code: 'error',
    message: err.message,
  });
};
