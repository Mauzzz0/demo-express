import 'express-async-errors';
import 'reflect-metadata';

import { Container } from 'inversify';

import { createAppModule } from './modules/app/app.module';
import { createTaskModule } from './modules/task/task.module';
import { createUserModule } from './modules/user/user.module';
import { RestApplication } from './rest.application';
import { Components } from './shared/di.types';

const bootstrap = async () => {
  const app = Container.merge(createAppModule(), createUserModule(), createTaskModule());

  const server = app.get<RestApplication>(Components.Application);
  await server.init();
};

bootstrap();
