import jwt from 'jsonwebtoken';

import config from '../config';
import { UserModel } from '../database/models';
import { BadRequestException } from '../errors';
import { TokenPair } from './jwt.types';

const makeTokenPair = (user: UserModel): TokenPair => {
  const payload = {
    id: user.id,
  };

  const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET);

  return { accessToken, refreshToken };
};

const verify = (token: string, type: 'access' | 'refresh'): boolean => {
  let result = false;

  const secret = type === 'access' ? config.JWT_ACCESS_SECRET : config.JWT_REFRESH_SECRET;

  jwt.verify(token, secret, (err) => {
    result = !err;
  });

  return result;
};

const decode = (token: string) => {
  const decoded = jwt.decode(token, { json: true });

  if (!decoded) {
    throw new BadRequestException('JWT is bad');
  }

  return decoded;
};

export const JwtService = {
  makeTokenPair,
  verify,
  decode,
};
