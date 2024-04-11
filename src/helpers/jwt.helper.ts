import jwt from 'jsonwebtoken';

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export const makeTokenPair = (payload: Record<string, any>): TokenPair => {
  const accessToken = jwt.sign(payload, 'a_secret', { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, 'r_secret');

  return { accessToken, refreshToken };
};
