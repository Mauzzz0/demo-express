import { CreateTask, PaginationAndSorting, Task } from './task.types';
import { taskRepository } from './task.repository';

const create = (task: CreateTask) => {
  return taskRepository.create(task);
};

const getAll = (params: PaginationAndSorting) => {
  return taskRepository.findAll(params.limit, params.offset, params.sort);
};

const getOne = (id: Task['id']) => {
  const task = taskRepository.findOne(id);
  if (!task) {
    throw Error(`Task with id [${id}] is not exist`);
  }

  return task;
};

const deleteOne = (id: Task['id']) => {
  getOne(id);

  return taskRepository.deleteOne(id);
};

const update = (id: Task['id'], data: CreateTask) => {
  getOne(id);

  return taskRepository.update(id, data);
};

export const TaskService = { create, getAll, getOne, deleteOne, update };
