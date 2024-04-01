import { CreateTask, Task } from './task.types';
import * as fs from 'fs';

let storage: Task[] = [];
const filename = 'database.json';
const saveDatabaseToFile = () =>
  fs.writeFileSync(filename, JSON.stringify(storage));
const extractId = ({ id }: { id: number }) => id;
const sortByDesc = (a: any, b: any) => (a < b ? 1 : -1);

if (fs.existsSync(filename)) {
  storage = JSON.parse(fs.readFileSync(filename, 'utf-8'));
} else {
  saveDatabaseToFile();
}

export const taskRepository = {
  get size() {
    return storage.length;
  },

  create(task: CreateTask): Task {
    const maxId = storage.map(extractId).sort(sortByDesc)[0] ?? 0;

    const taskToSave: Task = {
      id: maxId + 1,
      ...task,
    };

    storage.push(taskToSave);
    saveDatabaseToFile();

    return taskToSave;
  },

  findOne(id: Task['id']): Task | undefined {
    return storage.find((item) => item.id === id);
  },

  findAll(limit: number, offset = 0, key: keyof Task): Task[] {
    return storage
      .slice(offset, offset + limit)
      .sort((a, b) => (a[key] > b[key] ? 1 : -1));
  },

  deleteOne(id: Task['id']): number {
    const lenBefore = storage.length;

    storage = storage.filter((item) => item.id !== id);
    saveDatabaseToFile();

    return lenBefore - storage.length;
  },

  update(id: Task['id'], data: CreateTask): Task {
    const index = storage.findIndex((item) => item.id === id);

    if (index == -1) {
      throw Error(`Database Error!!!. Record with id [${id}] is not exist`);
    }

    const taskToSave = { ...storage[index], ...data };

    storage[index] = taskToSave;
    saveDatabaseToFile();

    return taskToSave;
  },
};
