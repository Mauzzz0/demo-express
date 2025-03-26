import { NextFunction, Request, Response } from 'express';
import logger from '../logger/pino.logger';

export const LogMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`[${req.method}]: ${req.url}`);

  next();
};
