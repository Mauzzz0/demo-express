type Task = {
  title: string;
  description: string;
};

type Pagination = {
  limit: number;
  offset: number;
};

const create = (task: Task) => {
  return task;
};

const getAll = (pagination: Pagination) => {
  return pagination;
};

export const TaskService = { create, getAll };
