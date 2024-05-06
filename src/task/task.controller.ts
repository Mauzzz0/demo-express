import { Request, Response } from 'express';
import { validate } from '../validation/validate';
import {
  PaginationAndSortingSchema,
  TaskSchema,
  PositiveNumberSchema,
} from './schemas';
import { TaskService } from './task.service';

const create = async (req: Request, res: Response) => {
  const payload = validate(req.body, TaskSchema);

  const result = await TaskService.create(payload);

  res.json(result);
};

const getAll = async (req: Request, res: Response) => {
  const payload = validate(req.query, PaginationAndSortingSchema);

  const result = await TaskService.getAll(payload);

  res.json(result);
};

const getOne = async (req: Request, res: Response) => {
  const id = validate(req.params.id, PositiveNumberSchema);

  const result = await TaskService.getOne(id);

  res.json(result);
};

const deleteOne = async (req: Request, res: Response) => {
  const id = validate(req.params.id, PositiveNumberSchema);

  const result = await TaskService.deleteOne(id);

  res.json(result);
};

const update = async (req: Request, res: Response) => {
  const id = validate(req.params.id, PositiveNumberSchema);
  const payload = validate(req.body, TaskSchema);

  const result = await TaskService.update(id, payload);

  res.json(result);
};

export const TaskController = { create, getAll, getOne, deleteOne, update };
