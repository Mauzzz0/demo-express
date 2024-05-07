import { Request, Response } from 'express';
import { validate } from '../validation/validate';
import {
  PaginationAndSortingSchema,
  PositiveNumberSchema,
  TaskSchema,
} from './schemas';
import { TaskService } from './task.service';

const create = async (req: Request, res: Response) => {
  const payload = validate(req.body, TaskSchema);

  const result = await TaskService.create(res.locals.userId, payload);

  res.json(result);
};

const getAll = async (req: Request, res: Response) => {
  const payload = validate(req.query, PaginationAndSortingSchema);

  const result = await TaskService.getAll(res.locals.userId, payload);

  res.json(result);
};

const getOne = async (req: Request, res: Response) => {
  const id = validate(req.params.id, PositiveNumberSchema);

  const result = await TaskService.getOne(res.locals.userId, id);

  res.json(result);
};

const deleteOne = async (req: Request, res: Response) => {
  const id = validate(req.params.id, PositiveNumberSchema);

  const result = await TaskService.deleteOne(res.locals.userId, id);

  res.json(result);
};

const update = async (req: Request, res: Response) => {
  const id = validate(req.params.id, PositiveNumberSchema);
  const payload = validate(req.body, TaskSchema);

  const result = await TaskService.update(res.locals.userId, id, payload);

  res.json(result);
};

export const TaskController = { create, getAll, getOne, deleteOne, update };
