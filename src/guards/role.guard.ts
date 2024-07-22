import { NextFunction, Request, Response } from 'express';

import { UserRole } from '../database/models';
import { ForbiddenException } from '../errors';

export const RoleGuard = (role: UserRole) => (req: Request, res: Response, next: NextFunction) => {
  const { userRole } = res.locals;

  // FYI: Так как у нас всего 2 роли, то остальные проверки можно опустить
  if (userRole !== UserRole.admin && role === UserRole.admin) {
    throw new ForbiddenException("You don't have permission");
  }

  next();
};
