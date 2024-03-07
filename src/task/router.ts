import express from 'express';
import { TaskController } from './controller';

export const taskRouter = express.Router();

taskRouter.get('/', TaskController.getAll);
taskRouter.post('/', TaskController.create);
