import { injectable } from 'inversify';
import { FindOptions, Op } from 'sequelize';
import { TaskEntity, UserEntity } from '../../database';
import { DepartmentEntity } from '../../database/entities/department.entity';
import { NotFoundException } from '../../exceptions';
import { PaginationDto } from '../../shared';
import { CreateTaskDto, GetTaskListDto } from './dto';

@injectable()
export class TaskService {
  private readonly joinUsers = [
    { model: UserEntity, as: 'author', attributes: ['id', 'name', 'email'], include: [DepartmentEntity] },
    { model: UserEntity, as: 'assignee', attributes: ['id', 'name', 'email'], include: [DepartmentEntity] },
  ];

  async create(authorId: number, dto: CreateTaskDto) {
    const assignee = await UserEntity.findByPk(dto.assigneeId);
    if (!assignee) {
      throw new NotFoundException(`User with id [${dto.assigneeId}] is not exist`);
    }

    return TaskEntity.create({ ...dto, authorId });
  }

  async getAll(params: GetTaskListDto) {
    const { limit, offset, sortDirection, sortBy, search, assigneeId, authorId } = params;

    const options: FindOptions<TaskEntity> = {
      limit,
      offset,
      where: {
        ...(authorId ? { authorId } : {}),
        ...(assigneeId ? { assigneeId } : {}),
      },
      order: [[sortBy, sortDirection]],
      include: [...this.joinUsers],
    };

    if (search) {
      const value = `%${search}%`;
      options.where = {
        ...options.where,
        [Op.or]: [{ title: { [Op.iLike]: value } }, { description: { [Op.iLike]: value } }],
      };
    }

    const { rows, count } = await TaskEntity.findAndCountAll(options);

    return { total: count, limit, offset, data: rows };
  }

  async getAssigned(query: PaginationDto, assigneeId: UserEntity['id']) {
    const { limit, offset } = query;

    const { rows, count } = await TaskEntity.findAndCountAll({
      limit,
      offset,
      where: { assigneeId },
      include: [...this.joinUsers],
    });

    return { total: count, limit, offset, data: rows };
  }

  async getAuthored(query: PaginationDto, authorId: UserEntity['id']) {
    const { limit, offset } = query;

    const { rows, count } = await TaskEntity.findAndCountAll({
      limit,
      offset,
      where: { authorId },
      include: [...this.joinUsers],
    });

    return { total: count, limit, offset, data: rows };
  }

  async getOne(id: TaskEntity['id']) {
    const task = await TaskEntity.findOne({
      where: { id },
      attributes: ['id', 'title', 'description', 'severity', 'createdAt'],
      include: [...this.joinUsers],
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
