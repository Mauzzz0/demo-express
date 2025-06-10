import { NextFunction, Request, Response } from 'express';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  TooManyRequestsException,
  UnauthorizedException,
} from '../exceptions';
import logger from '../logger';

export const ErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);

  const customExceptions = [
    NotFoundException,
    UnauthorizedException,
    ForbiddenException,
    BadRequestException,
    TooManyRequestsException,
  ];

  const isCustomException = customExceptions.find((ex) => err instanceof ex);

  res.status(isCustomException ? err?.code : 500).json({
    code: 'error',
    message: isCustomException ? err.message : 'Internal Server Error',
  });
};
