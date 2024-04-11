import { LoginDto, User } from './user.types';
import { userRepository } from './user.repository';
import { UnauthorizedException } from '../errors/UnauthorizedException';
import { makeTokenPair } from '../helpers/jwt.helper';
import { tokenRepository } from '../guards/tokens.repository';
import jwt from 'jsonwebtoken';

const profile = (id: User['id']) => {
  return userRepository.findById(id);
};

const login = (dto: LoginDto) => {
  const user = userRepository.findByNick(dto.nick);

  if (!user || user.password != dto.password) {
    throw new UnauthorizedException('Password is not correct or nick is bad');
  }

  const tokens = makeTokenPair({ id: user.id });

  tokenRepository.add(tokens.refreshToken);

  return tokens;
};

const refresh = (token: string) => {
  let accessToken = '';
  let refreshToken = '';

  jwt.verify(token, 'r_secret', (err, payload) => {
    const existsToken = tokenRepository.find(token);

    if (err || !existsToken || typeof payload != 'object') {
      throw new UnauthorizedException();
    }

    const { id } = payload;
    const pair = makeTokenPair({ id });

    accessToken = pair.accessToken;
    refreshToken = pair.refreshToken;

    tokenRepository.remove(token);
    tokenRepository.add(refreshToken);
  });

  return { accessToken, refreshToken };
};

export const UserService = { profile, login, refresh };
