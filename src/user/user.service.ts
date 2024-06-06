import { LoginDto, User } from './user.types';
import { UnauthorizedException } from '../errors/UnauthorizedException';
import { JwtService } from '../jwt/jwt.service';
import { compareSync, hashSync } from 'bcrypt';
import { BadRequestException } from '../errors';
import { UserModel } from '../database/models/user.model';
import { TokenModel } from '../database/models/token.model';

export class UserService {
  async profile(id: User['id']) {
    return UserModel.findByPk(id);
  }

  async login(dto: LoginDto) {
    const user = await UserModel.findOne({ where: { nick: dto.nick } });

    if (!user || !compareSync(dto.password, user.password)) {
      throw new UnauthorizedException('Password is not correct or nick is bad');
    }

    const tokens = JwtService.makeTokenPair({ id: user.id });

    await TokenModel.create({ token: tokens.refreshToken });

    return tokens;
  }

  async signup(dto: LoginDto) {
    const userWithSameNick = await UserModel.findOne({
      where: { nick: dto.nick },
    });

    if (userWithSameNick) {
      throw new BadRequestException('User with this nick already exists');
    }

    const salt = 10;
    dto.password = hashSync(dto.password, salt);

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

    const pair = JwtService.makeTokenPair({ id });

    await TokenModel.destroy({ where: { token } });
    await TokenModel.create({ token: pair.refreshToken });

    return pair;
  }
}
