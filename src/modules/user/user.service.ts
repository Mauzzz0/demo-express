import { compareSync, hashSync } from 'bcrypt';
import { inject, injectable } from 'inversify';

import { ConfigService } from '../../config/config.service';
import { UserModel } from '../../database/models';
import { RedisService } from '../../database/redis/redis.service';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '../../errors';
import { Components } from '../../shared/inversify.types';
import { PaginationDto } from '../../shared/pagination.dto';
import { JwtService } from './jwt.service';
import { LoginDto } from './user.dto';

@injectable()
export class UserService {
  private readonly redisRefreshTokenKey = (userId: number) => `refresh:user-${userId}`;

  constructor(
    @inject(Components.JwtService) private readonly jwtService: JwtService,
    @inject(Components.ConfigService) private readonly config: ConfigService,
    @inject(Components.Redis) private readonly redis: RedisService,
  ) {}

  private async setNewRefreshToken(userId: number, token: string) {
    const secondsInDay = 60 * 60 * 24;
    return this.redis.set(
      this.redisRefreshTokenKey(userId),
      { userId, token },
      { EX: secondsInDay },
    );
  }

  async profile(id: UserModel['id']) {
    const user = await UserModel.findByPk(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async blockOrUnblockUser(id: UserModel['id'], active: UserModel['active']) {
    const user = await this.profile(id);
    user.active = active;

    await user.save();

    return user;
  }

  async getAll(params: PaginationDto) {
    const { limit, offset } = params;
    const { rows, count } = await UserModel.findAndCountAll({ limit, offset });

    return { total: count, limit, offset, data: rows };
  }

  async login(dto: LoginDto) {
    const user = await UserModel.findOne({ where: { nick: dto.nick } });

    if (!user || !compareSync(dto.password, user.password)) {
      throw new UnauthorizedException('Password is not correct or nick is bad');
    }

    if (!user.active) {
      throw new ForbiddenException();
    }

    const tokens = this.jwtService.makeTokenPair(user);
    await this.setNewRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async register(dto: LoginDto) {
    const userWithSameNick = await UserModel.findOne({
      where: { nick: dto.nick },
    });

    if (userWithSameNick) {
      throw new BadRequestException('User with this nick already exists');
    }

    dto.password = hashSync(dto.password, this.config.env.SALT);

    // TODO: Пофиксить
    // @ts-ignore
    await UserModel.create(dto);

    return true;
  }

  async logout(userId: number) {
    await this.redis.delete(this.redisRefreshTokenKey(userId));

    return true;
  }

  async refresh(userId: number, token: string) {
    const refreshTokenData = await this.redis.get(this.redisRefreshTokenKey(userId));
    const valid = this.jwtService.verify(token, 'refresh');

    if (!valid || !refreshTokenData || token != refreshTokenData.token) {
      throw new UnauthorizedException();
    }

    const { id } = this.jwtService.decode(token);

    const user = await this.profile(id);

    const pair = this.jwtService.makeTokenPair(user);

    await this.redis.delete(this.redisRefreshTokenKey(userId));
    await this.setNewRefreshToken(user.id, pair.refreshToken);

    return pair;
  }
}
