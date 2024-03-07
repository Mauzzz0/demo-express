export type Task = {
  id: number;
  title: string;
  description: string;
};

export type CreateTask = Pick<Task, 'title' | 'description'>;

export type Pagination = {
  limit: number;
  offset: number;
};
