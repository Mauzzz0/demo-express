type Task = {
  id: number;
  title: string;
  description: string;
};

type CreateTask = Pick<Task, 'title' | 'description'>;

type Pagination = {
  limit: number;
  offset: number;
};

const create = (task: CreateTask) => {
  return task;
};

const getAll = (pagination: Pagination) => {
  return pagination;
};

const getOne = (id: Task['id']) => {
  return id;
};

const deleteOne = (id: Task['id']) => {
  return id;
};

export const TaskService = { create, getAll, getOne, deleteOne };
