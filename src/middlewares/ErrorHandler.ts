import { NextFunction, Request, Response } from 'express';

const ErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (!err) next();

  console.log(err);

  const status = err?.code ?? 500;

  res.status(status).json({
    code: 'error',
    message: err.message,
  });
};

export default ErrorHandler;
