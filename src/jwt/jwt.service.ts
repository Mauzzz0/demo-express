import jwt from 'jsonwebtoken';
import { TokenPair } from './jwt.types';
import config from '../config';
import { BadRequestException } from '../errors';

const makeTokenPair = (payload: Record<string, any>): TokenPair => {
  const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET);

  return { accessToken, refreshToken };
};

const verify = (token: string, type: 'access' | 'refresh'): boolean => {
  let result = false;

  const secret =
    type === 'access' ? config.JWT_ACCESS_SECRET : config.JWT_REFRESH_SECRET;

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
