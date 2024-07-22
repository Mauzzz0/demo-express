import { NextFunction, Request, Response } from 'express';

import { UnauthorizedException } from '../errors';
import { JwtService } from '../jwt/jwt.service';

const JwtGuard = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers['authorization'];

  if (!authorization) {
    throw new UnauthorizedException();
  }

  const [, token] = authorization.split(' ');

  if (!token) {
    throw new UnauthorizedException();
  }

  const valid = JwtService.verify(token, 'access');

  if (!valid) {
    throw new UnauthorizedException();
  }

  const payload = JwtService.decode(token);

  res.locals = {
    userId: payload.id,
    // userRole: payload.role,
  };

  next();
};

export default JwtGuard;
