import 'express-async-errors';
import 'reflect-metadata';

import { Container } from 'inversify';

import { createRedisModule } from './database/redis/redis.module';
import { RedisService } from './database/redis/redis.service';
import { App } from './modules/app/app';
import { createAppModule } from './modules/app/app.module';
import { createCronModule } from './modules/cron/cron.module';
import { CronService } from './modules/cron/cron.service';
import { createTaskModule } from './modules/task/task.module';
import { createTelegramModule } from './modules/telegram/telegram.module';
import { TelegramService } from './modules/telegram/telegram.service';
import { createUserModule } from './modules/user/user.module';
import { Components } from './shared/inversify.types';

const bootstrap = async () => {
  const app = Container.merge(
    createAppModule(),
    createUserModule(),
    createTaskModule(),
    createRedisModule(),
    createTelegramModule(),
    createCronModule(),
  );

  const redis = app.get<RedisService>(Components.Redis);
  await redis.connect();

  const telegram = app.get<TelegramService>(Components.Telegram);
  await telegram.start();

  const cron = app.get<CronService>(Components.CronService);
  cron.startJobs();

  const server = app.get<App>(Components.Application);
  await server.init();
};

bootstrap();
