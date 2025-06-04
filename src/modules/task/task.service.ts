import { injectable } from 'inversify';
import { TaskEntity, UserEntity } from '../../database/entities';
import { NotFoundException } from '../../errors';
import { CreateTaskDto, GetTaskListDto } from './task.dto';

@injectable()
export class TaskService {
  async create(authorId: number, dto: CreateTaskDto) {
    const assignee = await UserEntity.findOne({ where: { id: dto.assigneeId } });
    if (!assignee) {
      throw new NotFoundException(`User with id [${dto.assigneeId}] is not exist`);
    }

    return TaskEntity.create({ ...dto, authorId });
  }

  async getAll(params: GetTaskListDto) {
    const { limit, offset, sort } = params;
    const { rows, count } = await TaskEntity.findAndCountAll({
      limit,
      offset,
      order: [sort],
    });

    return { total: count, limit, offset, data: rows };
  }

  async getOne(id: TaskEntity['id']) {
    const task = await TaskEntity.findOne({
      where: { id },
      attributes: ['id', 'title', 'description', 'severity', 'createdAt'],
      include: [
        {
          model: UserEntity,
          as: 'author',
          attributes: ['id', 'nick'],
        },
        {
          model: UserEntity,
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

  async deleteOne(id: TaskEntity['id']) {
    await this.getOne(id);

    return TaskEntity.destroy({ where: { id } });
  }

  async update(id: TaskEntity['id'], dto: CreateTaskDto) {
    await this.getOne(id);
    const assignee = await UserEntity.findOne({ where: { id: dto.assigneeId } });
    if (!assignee) {
      throw new NotFoundException(`User with id [${dto.assigneeId}] is not exist`);
    }

    return TaskEntity.update(dto, { where: { id }, returning: true });
  }
}
