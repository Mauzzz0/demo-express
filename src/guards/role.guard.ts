import { NextFunction, Request, Response } from 'express';
import { ForbiddenException } from '../errors';

export enum Roles {
  user = 'user',
  admin = 'admin',
}

const RolesGuard = (role: Roles) => (req: Request, res: Response, next: NextFunction) => {
  const { userRole } = res.locals;

  // FYI: Так как у нас всего 2 роли, то остальные проверки можно опустить
  if (userRole !== Roles.admin && role === Roles.admin) {
    throw new ForbiddenException();
  }

  next();
};

export default RolesGuard;
