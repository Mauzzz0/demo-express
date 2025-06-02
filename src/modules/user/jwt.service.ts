import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { ConfigService } from '../../config/config.service';
import { UserModel } from '../../database/models';
import { BadRequestException } from '../../errors';
import { TokenPair } from './jwt.types';

@injectable()
export class JwtService {
  constructor(
    @inject(ConfigService)
    private readonly config: ConfigService,
  ) {}

  makeTokenPair(user: UserModel): TokenPair {
    const payload = { id: user.id };
    const { accessSecret, refreshSecret } = this.config.env.jwt;

    const accessToken = jwt.sign(payload, accessSecret, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '1w' });

    return { accessToken, refreshToken };
  }

  verify(token: string, type: 'access' | 'refresh'): boolean {
    let result = false;
    const { accessSecret, refreshSecret } = this.config.env.jwt;

    const secrets = {
      access: accessSecret,
      refresh: refreshSecret,
    };

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
