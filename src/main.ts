import express from 'express';
import { taskRouter } from './task/router';
import bodyParser from 'body-parser';
import { LogMiddleware } from './middlewares/LogMiddleware';
import { ErrorHandler } from './middlewares/ErrorHandler';

const server = express();
server.use(bodyParser.json());
server.use(LogMiddleware);

server.use('/task', taskRouter);

server.use(ErrorHandler);

const port = 2000;

server.listen(port, () => {
  console.log(`Server is started on port ${port}...`);
});
