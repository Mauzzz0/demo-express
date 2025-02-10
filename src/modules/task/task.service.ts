import { injectable } from 'inversify';
import { TaskModel, UserModel } from '../../database/models';
import { NotFoundException } from '../../errors';
import { CreateTaskDto, GetTaskListDto } from './task.dto';

@injectable()
export class TaskService {
  async create(authorId: number, dto: CreateTaskDto) {
    const assignee = await UserModel.findOne({ where: { id: dto.assigneeId } });
    if (!assignee) {
      throw new NotFoundException(`User with id [${dto.assigneeId}] is not exist`);
    }

    return TaskModel.create({ ...dto, authorId });
  }

  async getAll(params: GetTaskListDto) {
    const { limit, offset, sort } = params;
    const { rows, count } = await TaskModel.findAndCountAll({
      limit,
      offset,
      order: [sort],
    });

    return { total: count, limit, offset, data: rows };
  }

  async getOne(id: TaskModel['id']) {
    const task = await TaskModel.findOne({
      where: { id },
      attributes: ['id', 'title', 'description', 'severity', 'createdAt'],
      include: [
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

  async deleteOne(id: TaskModel['id']) {
    await this.getOne(id);

    return TaskModel.destroy({ where: { id } });
  }

  async update(id: TaskModel['id'], dto: CreateTaskDto) {
    await this.getOne(id);
    const assignee = await UserModel.findOne({ where: { id: dto.assigneeId } });
    if (!assignee) {
      throw new NotFoundException(`User with id [${dto.assigneeId}] is not exist`);
    }

    return TaskModel.update(dto, { where: { id }, returning: true });
  }
}
