import { CreateTask, Task } from './task.types';

let storage: Task[] = [];

const extractId = ({ id }: { id: number }) => id;
const sortByDesc = (a: any, b: any) => (a < b ? 1 : -1);

export const taskRepository = {
  create(task: CreateTask): Task {
    const maxId = storage.map(extractId).sort(sortByDesc)[0] ?? 0;

    const taskToSave: Task = {
      id: maxId + 1,
      ...task,
    };

    storage.push(taskToSave);

    return taskToSave;
  },

  findOne(id: Task['id']): Task | undefined {
    return storage.find((item) => item.id === id);
  },

  findAll(limit: number, offset = 0): Task[] {
    return storage.slice(offset, offset + limit);
  },

  deleteOne(id: Task['id']): number {
    const lenBefore = storage.length;

    storage = storage.filter((item) => item.id !== id);

    return lenBefore - storage.length;
  },

  update(id: Task['id'], data: CreateTask): Task {
    const index = storage.findIndex((item) => item.id === id);

    if (index == -1) {
      throw Error(`Database Error!!!. Record with id [${id}] is not exist`);
    }

    const taskToSave = { ...storage[index], ...data };

    storage[index] = taskToSave;

    return taskToSave;
  },
};
