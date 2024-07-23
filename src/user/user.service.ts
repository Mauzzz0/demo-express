import { compareSync, hashSync } from 'bcrypt';

import config from '../config';
import { TokenModel, UserModel } from '../database/models';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '../errors';
import { JwtService } from '../jwt/jwt.service';
import { PaginationDto } from '../shared/pagination.dto';
import { LoginDto } from './user.dto';

export class UserService {
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

    const tokens = JwtService.makeTokenPair(user);

    await TokenModel.create({ token: tokens.refreshToken, userId: user.id });

    return tokens;
  }

  async register(dto: LoginDto) {
    const userWithSameNick = await UserModel.findOne({
      where: { nick: dto.nick },
    });

    if (userWithSameNick) {
      throw new BadRequestException('User with this nick already exists');
    }

    dto.password = hashSync(dto.password, config.SALT);

    // TODO: Пофиксить
    // @ts-ignore
    await UserModel.create(dto);

    return true;
  }

  async refresh(token: string) {
    const existsToken = await TokenModel.findOne({ where: { token } });

    const valid = JwtService.verify(token, 'refresh');

    if (!valid || !existsToken) {
      throw new UnauthorizedException();
    }

    const { id } = JwtService.decode(token);

    const user = await this.profile(id);

    const pair = JwtService.makeTokenPair(user);

    await TokenModel.destroy({ where: { token } });
    await TokenModel.create({ token: pair.refreshToken });

    return pair;
  }
}
