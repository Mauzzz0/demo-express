import 'express-async-errors';
import 'reflect-metadata';
import { Container } from 'inversify';
import { createRedisModule } from './database/redis/redis.module';
import { RedisService } from './database/redis/redis.service';
import { createRabbitMQModule } from './message-broker/rabbitmq/rabbitmq.module';
import { App } from './modules/app/app';
import { createAppModule } from './modules/app/app.module';
import { createCronModule } from './modules/cron/cron.module';
import { CronService } from './modules/cron/cron.service';
import { createMailModule } from './modules/mail/mail.module';
import { createTaskModule } from './modules/task/task.module';
import { createTelegramModule } from './modules/telegram/telegram.module';
import { TelegramRabbitController } from './modules/telegram/telegram.rabbit-controller';
import { TelegramService } from './modules/telegram/telegram.service';
import { createUserModule } from './modules/user/user.module';

const bootstrap = async () => {
  const app = Container.merge(
    createAppModule(),
    createUserModule(),
    createTaskModule(),
    createRabbitMQModule(),
    createRedisModule(),
    createTelegramModule(),
    createCronModule(),
    createMailModule(),
  );

  app.get(TelegramRabbitController);

  const redis = app.get<RedisService>(RedisService);
  await redis.connect();

  const telegram = app.get<TelegramService>(TelegramService);
  await telegram.start();

  const cron = app.get<CronService>(CronService);
  cron.startJobs();

  const server = app.get<App>(App);
  await server.init();
};

bootstrap();
