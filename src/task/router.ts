import express from 'express';
import { TaskController } from './controller';

export const taskRouter = express.Router();

taskRouter.get('/:id', TaskController.getOne);
taskRouter.get('/', TaskController.getAll);
taskRouter.post('/', TaskController.create);
taskRouter.delete('/:id', TaskController.deleteOne);
