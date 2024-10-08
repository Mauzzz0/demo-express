import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../database/models';
import { UnauthorizedException } from '../errors';
import { JwtService } from '../modules/user/jwt.service';

export const JwtGuard = (jwtService: JwtService) => async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers['authorization'];

  if (!authorization) {
    throw new UnauthorizedException();
  }

  const [, token] = authorization.split(' ');

  if (!token) {
    throw new UnauthorizedException();
  }

  const valid = jwtService.verify(token, 'access');

  if (!valid) {
    throw new UnauthorizedException();
  }

  const payload = jwtService.decode(token);

  const user = await UserModel.findOne({ where: { id: payload?.id } });
  if (!user || !user.active) {
    throw new UnauthorizedException();
  }

  res.locals = {
    user: {
      id: user.id,
      role: user.role,
    },
  };

  next();
};
