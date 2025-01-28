import { Container } from 'inversify';
import { JwtService } from './jwt.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

export const createUserModule = () => {
  const container = new Container();

  container.bind(UserService).toSelf().inSingletonScope();
  container.bind(UserController).toSelf().inSingletonScope();

  container.bind(JwtService).toSelf().inSingletonScope();

  return container;
};
