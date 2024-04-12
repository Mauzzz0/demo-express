import { LoginDto, User } from './user.types';
import { userRepository } from './user.repository';
import { UnauthorizedException } from '../errors/UnauthorizedException';
import { tokenRepository } from '../jwt/tokens.repository';
import { JwtService } from '../jwt/jwt.service';
import { hashSync, compareSync } from 'bcrypt';
import { BadRequestException } from '../errors';

const profile = (id: User['id']) => {
  return userRepository.findById(id);
};

const login = (dto: LoginDto) => {
  const user = userRepository.findByNick(dto.nick);

  if (!user || !compareSync(dto.password, user.password)) {
    throw new UnauthorizedException('Password is not correct or nick is bad');
  }

  const tokens = JwtService.makeTokenPair({ id: user.id });

  tokenRepository.add(tokens.refreshToken);

  return tokens;
};

const signup = (dto: LoginDto) => {
  const userWithSameNick = userRepository.findByNick(dto.nick);
  if (userWithSameNick) {
    throw new BadRequestException('User with this nick already exists');
  }

  const salt = 10;
  dto.password = hashSync(dto.password, salt);

  userRepository.save(dto);

  return true;
};

const refresh = (token: string) => {
  const existsToken = tokenRepository.find(token);

  const valid = JwtService.verify(token, 'refresh');

  if (!valid || !existsToken) {
    throw new UnauthorizedException();
  }

  const { id } = JwtService.decode(token);

  const pair = JwtService.makeTokenPair({ id });

  tokenRepository.remove(token);
  tokenRepository.add(pair.refreshToken);

  return pair;
};

export const UserService = { profile, login, refresh, signup };
