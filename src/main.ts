import 'express-async-errors';
import 'reflect-metadata';

import { Container } from 'inversify';

import { createApplicationModule } from './modules/application/application.module';
import { createTaskModule } from './modules/task/task.module';
import { createUserModule } from './modules/user/user.module';
import { RestApplication } from './rest.application';
import { Components } from './shared/di.types';

const bootstrap = () => {
  const appContainer = Container.merge(
    createApplicationModule(),
    createUserModule(),
    createTaskModule(),
  );

  const server = appContainer.get<RestApplication>(Components.Application);
  server.init();
};

bootstrap();
