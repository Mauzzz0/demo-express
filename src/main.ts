import 'express-async-errors';
import 'reflect-metadata';

import { Container } from 'inversify';

import { createRedisModule } from './database/redis/redis.module';
import { RedisService } from './database/redis/redis.service';
import { App } from './modules/app/app';
import { createAppModule } from './modules/app/app.module';
import { createTaskModule } from './modules/task/task.module';
import { createUserModule } from './modules/user/user.module';
import { Components } from './shared/inversify.types';

const bootstrap = async () => {
  const app = Container.merge(
    createAppModule(),
    createUserModule(),
    createTaskModule(),
    createRedisModule(),
  );

  const redis = app.get<RedisService>(Components.Redis);
  await redis.connect();

  const server = app.get<App>(Components.Application);
  await server.init();
};

bootstrap();
