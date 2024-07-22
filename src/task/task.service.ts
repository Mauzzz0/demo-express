import { Sequelize } from 'sequelize-typescript';

import { TaskModel, TimeModel, UserModel } from '../database/models';
import { NotFoundException } from '../errors';
import { CreateTaskDto, PaginationAndSortingDto, Task } from './task.dto';

export class TaskService {
  async create(authorId: number, task: CreateTaskDto) {
    return TaskModel.create({ ...task, authorId });
  }

  async getAll(params: PaginationAndSortingDto) {
    const { limit, offset, sort } = params;
    const { rows, count } = await TaskModel.findAndCountAll({
      limit,
      offset,
      order: [sort],
    });

    return { total: count, limit, offset, data: rows };
  }

  async getOne(id: Task['id']) {
    const task = await TaskModel.findOne({
      where: { id },
      attributes: [
        'id',
        'title',
        'description',
        'severity',
        'createdAt',
        [Sequelize.literal(`sum(time) over ()`), 'spentTime'],
      ],
      include: [
        {
          model: TimeModel,
          attributes: ['date', 'time'],
          order: [['date', 'desc']],
          include: [{ model: UserModel, attributes: ['id', 'nick'] }],
        },
        {
          model: UserModel,
          as: 'author',
          attributes: ['id', 'nick'],
        },
        {
          model: UserModel,
          as: 'assignee',
          attributes: ['id', 'nick'],
        },
      ],
    });

    if (!task) {
      throw new NotFoundException(`Task with id [${id}] is not exist`);
    }

    return task;
  }

  async deleteOne(id: Task['id']) {
    await this.getOne(id);

    return TaskModel.destroy({ where: { id } });
  }

  async update(id: Task['id'], data: CreateTaskDto) {
    await this.getOne(id);

    return TaskModel.update(data, { where: { id }, returning: true });
  }
}
