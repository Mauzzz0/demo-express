import express from 'express';
import cors from 'cors';
import { taskRouter } from './task/task.router';
import bodyParser from 'body-parser';
import { LogMiddleware } from './middlewares/LogMiddleware';
import { ErrorHandler } from './middlewares/ErrorHandler';
import { logRoutes } from './bootstrap/logRoutes';
import dotenv from 'dotenv';

dotenv.config();

const server = express();
server.use(bodyParser.json());
server.use(LogMiddleware);
server.use(cors({ origin: '*' }));

server.use('/task', taskRouter);

server.use(ErrorHandler);

logRoutes(server);

const port = Number(process.env.PORT);

server.listen(port, () => {
  console.log(`Server is started on port ${port}...`);
});
