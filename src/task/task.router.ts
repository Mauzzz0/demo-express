import express from 'express';
import { TaskController } from './task.controller';

export const taskRouter = express.Router();

taskRouter.post('/', TaskController.create);
taskRouter.get('/', TaskController.getAll);
taskRouter.get('/:id', TaskController.getOne);
taskRouter.put('/:id', TaskController.update);
taskRouter.delete('/:id', TaskController.deleteOne);
