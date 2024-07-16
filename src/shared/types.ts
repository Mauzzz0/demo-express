import { NextFunction, Request, Response } from 'express';

export interface Route {
  path: string;
  method?: 'get' | 'post' | 'put' | 'delete';
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: Middleware[];
}

export type Middleware = (req: Request, res: Response, next: NextFunction) => void;
