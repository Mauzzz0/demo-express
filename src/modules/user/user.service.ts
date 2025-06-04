import { compare, hash } from 'bcrypt';
import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';
import { redisRefreshTokenKey, redisRestorePasswordKey, redisTelegramKey } from '../../cache/redis.keys';
import { RedisService } from '../../cache/redis.service';
import { UserEntity } from '../../database';
import { BadRequestException, ForbiddenException, NotFoundException, UnauthorizedException } from '../../errors';
import { NEW_REGISTRATION_QUEUE } from '../../message-broker/rabbitmq/rabbitmq.queues';
import { RabbitMqService } from '../../message-broker/rabbitmq/rabbitmq.service';
import { PaginationDto } from '../../shared/pagination.dto';
import { MailService } from '../mail/mail.service';
import { TelegramService } from '../telegram/telegram.service';
import { JwtService } from './jwt.service';
import { ChangePasswordDto, LoginDto, RegisterDto } from './user.dto';

@injectable()
export class UserService {
  constructor(
    @inject(JwtService) private readonly jwtService: JwtService,
    @inject(MailService) private readonly mail: MailService,
    @inject(RedisService) private readonly redis: RedisService,
    @inject(TelegramService) private readonly telegram: TelegramService,
    @inject(RabbitMqService) private readonly rabbitMqService: RabbitMqService,
  ) {}

  private async setNewRefreshToken(userId: number, token: string) {
    const secondsInDay = 60 * 60 * 24;
    return this.redis.set(redisRefreshTokenKey(token), { userId }, { EX: secondsInDay });
  }

  async passwordRestore(email: UserEntity['email']) {
    const user = await UserEntity.findOne({ where: { email } });
    if (!user) {
      return true;
    }

    const restoreKey = v4();

    await this.redis.set(redisRestorePasswordKey(user.id), { restoreKey }, { EX: 3600 });
    await this.mail.sendRestoreMessage(user.email, restoreKey);

    return true;
  }

  async getTelegramLink(userId: number) {
    const key = v4();
    await this.redis.set(redisTelegramKey(key), { userId }, { EX: 3600 });

    const { username } = await this.telegram.bot.telegram.getMe();

    const link = `https://t.me/${username}?start=${key}`;

    return { link };
  }

  async passwordChange(dto: ChangePasswordDto) {
    const { email, restoreKey, password } = dto;

    const user = await UserEntity.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException();
    }

    const value = await this.redis.get(redisRestorePasswordKey(user.id));
    if (!value || value.restoreKey !== restoreKey) {
      throw new UnauthorizedException();
    }

    user.password = await this.hashPassword(dto.password);
    await user.save();

    await this.redis.delete(redisRestorePasswordKey(user.id));

    return true;
  }

  async profile(id: UserEntity['id']) {
    const user = await UserEntity.findByPk(id, { attributes: { exclude: ['password'] } });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async blockOrUnblockUser(id: UserEntity['id'], active: UserEntity['active']) {
    const user = await this.profile(id);
    user.active = active;

    await user.save();

    return user;
  }

  async getAll(params: PaginationDto) {
    const { limit, offset } = params;
    const { rows, count } = await UserEntity.findAndCountAll({ limit, offset });

    return { total: count, limit, offset, data: rows };
  }

  async login(dto: LoginDto) {
    const user = await UserEntity.findOne({ where: { nick: dto.nick } });

    if (!user || !(await compare(dto.password, user.password))) {
      throw new UnauthorizedException('User does not exists or password is wrong');
    }

    if (!user.active) {
      throw new ForbiddenException();
    }

    const tokens = this.jwtService.makeTokenPair(user);
    await this.setNewRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async register(dto: RegisterDto) {
    const userWithSameEmail = await UserEntity.findOne({
      where: { email: dto.email },
    });

    if (userWithSameEmail) {
      throw new BadRequestException('User with this email already exists');
    }

    dto.password = await this.hashPassword(dto.password);

    const created = await UserEntity.create({
      email: dto.email,
      nick: dto.nick,
      password: dto.password,
    });

    await this.rabbitMqService.channel.sendToQueue(NEW_REGISTRATION_QUEUE, dto);

    return this.profile(created.id);
  }

  async logout(refreshToken: string) {
    await this.redis.delete(redisRefreshTokenKey(refreshToken));

    return true;
  }

  async refresh(token: string) {
    const refreshTokenData = await this.redis.get(redisRefreshTokenKey(token));
    const valid = this.jwtService.verify(token, 'refresh');

    if (!valid || !refreshTokenData) {
      throw new UnauthorizedException();
    }

    const { userId } = this.jwtService.decode(token);

    const user = await this.profile(userId);

    const pair = this.jwtService.makeTokenPair(user);

    await this.redis.delete(redisRefreshTokenKey(token));
    await this.setNewRefreshToken(user.id, pair.refreshToken);

    return pair;
  }

  private async hashPassword(raw: string): Promise<string> {
    return hash(raw, 10);
  }
}
