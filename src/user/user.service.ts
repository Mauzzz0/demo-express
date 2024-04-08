import { LoginDto, User } from './user.types';
import { userRepository } from './user.repository';
import { UnauthorizedException } from '../errors/UnauthorizedException';

const profile = (id: User['id']) => {
  return userRepository.findById(id);
};

const login = (dto: LoginDto) => {
  const user = userRepository.findByNick(dto.nick);

  if (!user || user.password != dto.password) {
    //TODO: Этот момент с уточнение типа в IF записать
    throw new UnauthorizedException('Password is not correct or nick is bad');
  }

  return user;
};

export const UserService = { profile, login };
