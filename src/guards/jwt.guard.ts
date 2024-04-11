import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedException } from '../errors/UnauthorizedException';

const JwtGuard = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers['authorization'];

  if (!authorization) {
    throw new UnauthorizedException();
  }

  const [, token] = authorization.split(' ');

  if (!token) {
    throw new UnauthorizedException();
  }

  jwt.verify(token, 'a_secret', (err, payload) => {
    if (err || typeof payload != 'object') {
      throw new UnauthorizedException();
    }

    res.locals = {
      userId: payload.id,
    };

    next();
  });
};

export default JwtGuard;
