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
import RabbitMqModule from './message-broker/rabbitmq.module';
import { ErrorHandler, RateLimiter, SessionMiddleware, ViewsMiddleware } from './middlewares';
import { DepartmentController } from './modules/department/department.controller';
import DepartmentModule from './modules/department/department.module';
import JwtModule from './modules/jwt/jwt.module';
import MailModule from './modules/mail/mail.module';
import { TaskController } from './modules/task/task.controller';
import TaskModule from './modules/task/task.module';
import TelegramModule from './modules/telegram/telegram.module';
import { UserAmqpController } from './modules/user/user.amqp-controller';
import { UserController } from './modules/user/user.controller';
import UserModule from './modules/user/user.module';
import { setupSwagger } from './swagger/setup-swagger';

const bootstrap = async () => {
  // * * * * * * * * * * * * * * * *
  // DI Container
  // * * * * * * * * * * * * * * * *
  const appContainer = new Container();

  await appContainer.load(
    UserModule,
    TaskModule,
    DepartmentModule,
    JwtModule,
    RabbitMqModule,
    RedisModule,
    TelegramModule,
    MailModule,
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
  const userController = appContainer.get(UserController);
  const departmentController = appContainer.get(DepartmentController);
  const taskController = appContainer.get(TaskController);

  server.use('/user', userController.router);
  server.use('/department', departmentController.router);
  server.use('/task', taskController.router);

  // * * * * * * * * * * * * * * * *
  // AMQP Controllers. Forced manual instantiating
  // * * * * * * * * * * * * * * * *
  appContainer.get(UserAmqpController);

  // * * * * * * * * * * * * * * * *
  // Configure Swagger
  // * * * * * * * * * * * * * * * *
  setupSwagger(server);

  // * * * * * * * * * * * * * * * *
  // Error Handlers
  // * * * * * * * * * * * * * * * *
  server.use(ErrorHandler);

  // * * * * * * * * * * * * * * * *
  // Log Registered Routes
  // * * * * * * * * * * * * * * * *
  logRoutes(server);

  // * * * * * * * * * * * * * * * *
  // Start Listening for Incoming HTTP Requests on Specified Port
  // * * * * * * * * * * * * * * * *
  server.listen(appConfig.port, () => {
    logger.info(`Server is started on port ${appConfig.port}`);
  });
};

bootstrap();
