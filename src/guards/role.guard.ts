import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../database/models';
import { ForbiddenException } from '../errors';

export const RoleGuard = (requiredRole: UserRole) => (req: Request, res: Response, next: NextFunction) => {
  const {
    user: { role },
  } = res.locals;

  if (role !== UserRole.admin && requiredRole === UserRole.admin) {
    throw new ForbiddenException("You don't have permission");
  }

  next();
};
