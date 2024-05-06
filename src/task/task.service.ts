import { CreateTask, PaginationAndSorting, Task } from './task.types';
import { NotFoundException } from '../errors';
import { TaskModel } from '../database/models/task.model';

const create = async (task: CreateTask) => {
  return TaskModel.create(task);
};

const getAll = async (params: PaginationAndSorting) => {
  const { limit, offset, sort } = params;
  const { rows, count } = await TaskModel.findAndCountAll({
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

const getOne = async (id: Task['id']) => {
  const task = await TaskModel.findByPk(id);

  if (!task) {
    throw new NotFoundException(`Task with id [${id}] is not exist`);
  }

  return task;
};

const deleteOne = async (id: Task['id']) => {
  await getOne(id);

  return TaskModel.destroy({ where: { id } });
};

const update = async (id: Task['id'], data: CreateTask) => {
  await getOne(id);

  return TaskModel.update(data, { where: { id } });
};

export const TaskService = { create, getAll, getOne, deleteOne, update };
