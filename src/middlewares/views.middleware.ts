import { NextFunction, Request, Response } from 'express';

export const ViewsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { views = 0 } = req.session;
  req.session.views = views + 1;

  next();
};
