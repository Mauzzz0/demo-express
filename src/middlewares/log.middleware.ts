import { NextFunction, Request, Response } from 'express';

export const LogMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${req.method}]: ${req.url}`);
  console.log({
    query: req.query,
    body: req.body,
  });
  console.log();

  next();
};
