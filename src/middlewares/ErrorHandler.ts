import { Response, Request, NextFunction } from 'express';

export const ErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!err) next();

  console.log(err);

  res.status(500).json({
    code: 'error',
    message: err.message,
  });
};
