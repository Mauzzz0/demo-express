import express from 'express';
import cors from 'cors';
import { taskRouter } from './task/task.router';
import LogMiddleware from './middlewares/LogMiddleware';
import SessionMiddleware from './middlewares/SessionMiddleware';
import ErrorHandler from './middlewares/ErrorHandler';
import { logRoutes } from './bootstrap/logRoutes';
import config from './config';
import { userRouter } from './user/user.router';
import ViewsMiddleware from './middlewares/ViewsMiddleware';
import JwtGuard from './jwt/jwt.guard';
import { connectDatabase } from './database/connect';
import { startAndReturnBot } from './bot';
import { spamTelegramJob } from './jobs/spam.telegram.job';

const bootstrap = async () => {
  const server = express();

  server.use(SessionMiddleware);
  server.use(ViewsMiddleware);
  server.use(express.json());
  server.use(LogMiddleware);
  server.use(cors({ origin: '*' }));

  server.use('/user', userRouter);
  server.use('/task', JwtGuard, taskRouter);

  server.use(ErrorHandler);

  logRoutes(server);

  await connectDatabase();
  server.listen(config.PORT, () => {
    console.log(`Server is started on port ${config.PORT}...`);
  });

  const tgBot = startAndReturnBot(config.TELEGRAM_TOKEN);

  spamTelegramJob(tgBot, config.TELEGRAM_CHAT_ID);
};

bootstrap();
