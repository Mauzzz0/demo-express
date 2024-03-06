import express from 'express';
import { createOne, getAll, getOne } from './handlers';

export const taskRouter = express.Router();

taskRouter.get('/', getAll);
taskRouter.get('/:id', getOne);
taskRouter.post('/', createOne);
