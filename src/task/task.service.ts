import { CreateTask, PaginationAndSorting, Task } from './task.types';
import { NotFoundException } from '../errors';
import { TaskModel } from '../database/models/task.model';

export class TaskService {
  async create(userId: number, task: CreateTask) {
    return TaskModel.create({ ...task, userId });
  }

  async getAll(userId: number, params: PaginationAndSorting) {
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
  }

  async getOne(userId: number, id: Task['id']) {
    const task = await TaskModel.findOne({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException(`Task with id [${id}] is not exist`);
    }

    return task;
  }

  async deleteOne(userId: number, id: Task['id']) {
    await this.getOne(userId, id);

    return TaskModel.destroy({ where: { id, userId } });
  }

  async update(userId: number, id: Task['id'], data: CreateTask) {
    await this.getOne(userId, id);

    return TaskModel.update(data, { where: { id, userId } });
  }
}
