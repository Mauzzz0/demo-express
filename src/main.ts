import 'express-async-errors';
import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import { Container } from 'inversify';
import { logRoutes } from './bootstrap';
import RedisModule from './cache/redis.module';
import { appConfig } from './config';
import { connectToPostgres } from './database';
import logger from './logger';
import { createRabbitMQModule } from './message-broker/rabbitmq.module';
import { ErrorHandler, RateLimiter, SessionMiddleware, ViewsMiddleware } from './middlewares';
import { createCronModule } from './modules/cron/cron.module';
import { CronService } from './modules/cron/cron.service';
import { createMailModule } from './modules/mail/mail.module';
import { TaskController } from './modules/task/task.controller';
import { createTaskModule } from './modules/task/task.module';
import { createTelegramModule } from './modules/telegram/telegram.module';
import { TelegramRabbitController } from './modules/telegram/telegram.rabbit-controller';
import { TelegramService } from './modules/telegram/telegram.service';
import { UserController } from './modules/user/user.controller';
import { createUserModule } from './modules/user/user.module';
import { setupSwagger } from './swagger/setup-swagger';

const bootstrap = async () => {
  // * * * * * * * * * * * * * * * *
  // DI Container
  // * * * * * * * * * * * * * * * *
  const app = Container.merge(
    createUserModule(),
    createTaskModule(),
    createRabbitMQModule(),
    RedisModule,
    createTelegramModule(),
    createCronModule(),
    createMailModule(),
  );

  // * * * * * * * * * * * * * * * *
  // Establish connection to PostgreSQL
  // * * * * * * * * * * * * * * * *
  await connectToPostgres();

  // * * * * * * * * * * * * * * * *
  // Create HTTP Express Server
  // * * * * * * * * * * * * * * * *
  const server = express();

  // * * * * * * * * * * * * * * * *
  // Middlewares
  // * * * * * * * * * * * * * * * *
  server.use(RateLimiter);
  server.use(SessionMiddleware);
  server.use(ViewsMiddleware);
  server.use(express.json());
  server.use(cors({ origin: '*' }));

  // * * * * * * * * * * * * * * * *
  // HTTP Controllers
  // * * * * * * * * * * * * * * * *
  const userController = app.get(UserController);
  const taskController = app.get(TaskController);

  server.use('/user', userController.router);
  server.use('/task', taskController.router);

  // * * * * * * * * * * * * * * * *
  // Error Handlers
  // * * * * * * * * * * * * * * * *
  server.use(ErrorHandler);

  // * * * * * * * * * * * * * * * *
  // AMQP Controllers
  // * * * * * * * * * * * * * * * *
  app.get(TelegramRabbitController);

  // * * * * * * * * * * * * * * * *
  // Configure Swagger
  // * * * * * * * * * * * * * * * *
  setupSwagger(server);

  // * * * * * * * * * * * * * * * *
  // Log Registered Routes
  // * * * * * * * * * * * * * * * *
  logRoutes(server);

  const telegram = app.get<TelegramService>(TelegramService);
  await telegram.start();

  const cron = app.get<CronService>(CronService);
  cron.startJobs();

  // * * * * * * * * * * * * * * * *
  // Start Listening for Incoming HTTP Requests on Specified Port
  // * * * * * * * * * * * * * * * *
  server.listen(appConfig.port, () => {
    logger.info(`Server is started on port ${appConfig.port}...`);
  });
};

bootstrap();
