import express from 'express';
import cors from 'cors';
import { taskRouter } from './task/task.router';
import LogMiddleware from './middlewares/LogMiddleware';
import SessionMiddleware from './middlewares/SessionMiddleware';
import ErrorHandler from './middlewares/ErrorHandler';
import { logRoutes } from './bootstrap/logRoutes';
import config from './config';

const server = express();

server.use(SessionMiddleware);
server.use(express.json());
server.use(LogMiddleware);
server.use(cors({ origin: '*' }));

server.use('/session', (req, res) => {
  const { views = 0 } = req.session;
  req.session.views = views + 1;

  res.json(req.session);
});

server.use('/task', taskRouter);

server.use(ErrorHandler);

logRoutes(server);

server.listen(config.PORT, () => {
  console.log(`Server is started on port ${config.PORT}...`);
});
