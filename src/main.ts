import express from 'express';
import { taskRouter } from './task/router';
import bodyParser from 'body-parser';

const server = express();
server.use(bodyParser.json());

server.use('/user', taskRouter);

const port = 2000;

server.listen(port, () => {
  console.log(`Server is started on port ${port}...`);
});
