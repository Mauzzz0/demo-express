import express from 'express';
import { TaskController } from './controller';

export const taskRouter = express.Router();

taskRouter.post('/', TaskController.create);
taskRouter.get('/', TaskController.getAll);
taskRouter.get('/:id', TaskController.getOne);
taskRouter.put('/:id', TaskController.update);
taskRouter.delete('/:id', TaskController.deleteOne);
