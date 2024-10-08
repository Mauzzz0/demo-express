import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { ConfigService } from '../../config/config.service';
import { UserModel } from '../../database/models';
import { BadRequestException } from '../../errors';
import { Components } from '../../shared/inversify.types';
import { TokenPair } from './jwt.types';

@injectable()
export class JwtService {
  constructor(
    @inject(Components.ConfigService)
    private readonly config: ConfigService,
  ) {}

  makeTokenPair(user: UserModel): TokenPair {
    const payload = { id: user.id };

    const accessToken = jwt.sign(payload, this.config.env.jwt.accessSecret, {
      expiresIn: '1h',
    });
    const refreshToken = jwt.sign(payload, this.config.env.jwt.refreshSecret);

    return { accessToken, refreshToken };
  }

  verify(token: string, type: 'access' | 'refresh'): boolean {
    let result = false;

    const secret = type === 'access' ? this.config.env.jwt.accessSecret : this.config.env.jwt.refreshSecret;

    jwt.verify(token, secret, (err) => {
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
