import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { appConfig } from '../../config';
import { UserEntity } from '../../database';
import { BadRequestException } from '../../errors';
import { TokenPair } from './jwt.types';

@injectable()
export class JwtService {
  makeTokenPair(user: UserEntity): TokenPair {
    const payload = { id: user.id };
    const { accessSecret, refreshSecret } = appConfig.jwt;

    const accessToken = jwt.sign(payload, accessSecret, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '1w' });

    return { accessToken, refreshToken };
  }

  verify(token: string, type: 'access' | 'refresh'): boolean {
    let result = false;
    const { accessSecret, refreshSecret } = appConfig.jwt;

    const secrets = {
      access: accessSecret,
      refresh: refreshSecret,
    };

    // <-- @Todo: Проверить если тут кидает ошибку то можно try catch
    jwt.verify(token, secrets[type], (err) => {
      result = !err;
    });

    return result;
  }

  decode(token: string) {
    const decoded = jwt.decode(token, { json: true });

    if (!decoded) {
      throw new BadRequestException('JWT is bad');
    }

    return decoded;
  }
}
