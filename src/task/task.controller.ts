import { Request, Response } from 'express';
import { validate } from '../validation/validate';
import {
  PaginationAndSortingSchema,
  TaskSchema,
  PositiveNumberSchema,
} from './schemas';
import { TaskService } from './task.service';

const create = (req: Request, res: Response) => {
  const payload = validate(req.body, TaskSchema);

  const result = TaskService.create(payload);

  res.json(result);
};

const getAll = (req: Request, res: Response) => {
  const payload = validate(req.query, PaginationAndSortingSchema);

  const result = TaskService.getAll(payload);

  res.json(result);
};

const getOne = (req: Request, res: Response) => {
  const id = validate(req.params.id, PositiveNumberSchema);

  const result = TaskService.getOne(id);

  res.json(result);
};

const deleteOne = (req: Request, res: Response) => {
  const id = validate(req.params.id, PositiveNumberSchema);

  const result = TaskService.deleteOne(id);

  res.json(result);
};

const update = (req: Request, res: Response) => {
  const id = validate(req.params.id, PositiveNumberSchema);
  const payload = validate(req.body, TaskSchema);

  const result = TaskService.update(id, payload);

  res.json(result);
};

export const TaskController = { create, getAll, getOne, deleteOne, update };
