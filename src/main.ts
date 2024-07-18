import 'express-async-errors';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import LogMiddleware from './middlewares/LogMiddleware';
import SessionMiddleware from './middlewares/SessionMiddleware';
import ErrorHandler from './middlewares/ErrorHandler';
import { logRoutes } from './bootstrap/logRoutes';
import config from './config';
import ViewsMiddleware from './middlewares/ViewsMiddleware';
import { connectDatabase } from './database/connect';
import { setupSwagger } from './swagger/setupSwagger';
import { taskController } from './task/task.module';
import { userController } from './user/user.module';

const bootstrap = async () => {
  const server = express();

  server.use(SessionMiddleware);
  server.use(ViewsMiddleware);
  server.use(express.json());
  server.use(LogMiddleware);
  server.use(cors({ origin: '*' }));

  server.use('/user', userController.router);
  server.use('/task', taskController.router);
  setupSwagger(server);

  server.use(ErrorHandler);

  logRoutes(server);

  await connectDatabase();
  server.listen(config.PORT, () => {
    console.log(`Server is started on port ${config.PORT}...`);
  });
};

bootstrap();
