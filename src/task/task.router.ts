import express from 'express';
import { TaskController } from './task.controller';
import JwtGuard from '../jwt/jwt.guard';

export const taskRouter = express.Router();

taskRouter.post('/', JwtGuard, TaskController.create);
taskRouter.get('/', JwtGuard, TaskController.getAll);
taskRouter.get('/:id', JwtGuard, TaskController.getOne);
taskRouter.put('/:id', JwtGuard, TaskController.update);
taskRouter.delete('/:id', JwtGuard, TaskController.deleteOne);
