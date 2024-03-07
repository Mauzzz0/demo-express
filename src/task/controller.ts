import { Request, Response } from 'express';
import { validate } from '../validation/validate';
import { PaginationSchema, TaskSchema } from './schemas';
import { TaskService } from './service';

const create = (req: Request, res: Response) => {
  const payload = validate(req.body, TaskSchema);

  const result = TaskService.create(payload);

  res.json(result);
};

const getAll = (req: Request, res: Response) => {
  const payload = validate(req.query, PaginationSchema);

  const result = TaskService.getAll(payload);

  res.json(result);
};

export const TaskController = { create, getAll };
