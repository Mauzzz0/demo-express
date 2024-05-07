import { CreateTask, PaginationAndSorting, Task } from './task.types';
import { NotFoundException } from '../errors';
import { TaskModel } from '../database/models/task.model';

const create = async (userId: number, task: CreateTask) => {
  return TaskModel.create({ ...task, userId });
};

const getAll = async (userId: number, params: PaginationAndSorting) => {
  const { limit, offset, sort } = params;
  const { rows, count } = await TaskModel.findAndCountAll({
    where: { userId },
    limit,
    offset,
    order: [sort],
  });

  return {
    total: count,
    limit,
    offset,
    data: rows,
  };
};

const getOne = async (userId: number, id: Task['id']) => {
  const task = await TaskModel.findOne({
    where: { id, userId },
  });

  if (!task) {
    throw new NotFoundException(`Task with id [${id}] is not exist`);
  }

  return task;
};

const deleteOne = async (userId: number, id: Task['id']) => {
  await getOne(userId, id);

  return TaskModel.destroy({ where: { id, userId } });
};

const update = async (userId: number, id: Task['id'], data: CreateTask) => {
  await getOne(userId, id);

  return TaskModel.update(data, { where: { id, userId } });
};

export const TaskService = { create, getAll, getOne, deleteOne, update };
