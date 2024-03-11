export type Task = {
  id: number;
  title: string;
  description: string;
};

export type CreateTask = Pick<Task, 'title' | 'description'>;

export type PaginationAndSorting = {
  limit: number;
  offset: number;
  sort: 'id' | 'title' | 'description';
};
