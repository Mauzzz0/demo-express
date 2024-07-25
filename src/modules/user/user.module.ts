import { Container } from 'inversify';

import { Components } from '../../shared/inversify.types';
import { JwtService } from './jwt.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

export const createUserModule = () => {
  const container = new Container();

  container.bind(Components.UserService).to(UserService).inSingletonScope();
  container.bind(Components.UserController).to(UserController).inSingletonScope();

  container.bind(Components.JwtService).to(JwtService).inSingletonScope();

  return container;
};
