import { injectable } from 'inversify';
import { FindOptions, Includeable, Op } from 'sequelize';
import { TaskEntity, UserEntity } from '../../database';
import { DepartmentEntity } from '../../database/entities/department.entity';
import { NotFoundException } from '../../exceptions';
import logger from '../../logger';
import { PaginationDto } from '../../shared';
import { CreateTaskDto, GetTaskListDto, UpdateTaskDto } from './dto';

@injectable()
export class TaskService {
  private readonly joinUsersAndDepartments: Includeable[] = [
    {
      model: UserEntity,
      as: 'author',
      attributes: ['id', 'name', 'email'],
      include: [{ model: DepartmentEntity, attributes: ['id', 'title'] }],
    },
    {
      model: UserEntity,
      as: 'assignee',
      attributes: ['id', 'name', 'email'],
      include: [{ model: DepartmentEntity, attributes: ['id', 'title'] }],
    },
  ];

  async create(authorId: number, dto: CreateTaskDto) {
    logger.info(`Создание задачи ${dto.title}`);

    if (dto.assigneeId) {
      const assignee = await UserEntity.findByPk(dto.assigneeId);
      if (!assignee) {
        throw new NotFoundException(`User with id [${dto.assigneeId}] is not exist`);
      }
    }

    return TaskEntity.create({ ...dto, authorId });
  }

  async getAll(params: GetTaskListDto) {
    logger.info('Чтение списка задач');
    const { limit, offset, sortDirection, sortBy, search, assigneeId, authorId } = params;

    const options: FindOptions<TaskEntity> = {
      limit,
      offset,
      where: {
        ...(authorId ? { authorId } : {}),
        ...(assigneeId ? { assigneeId } : {}),
      },
      order: [[sortBy, sortDirection]],
      include: [...this.joinUsersAndDepartments],
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
    logger.info(`Чтение назначенных задач для пользователя assigneeId=${assigneeId}`);
    const { limit, offset } = query;

    const { rows, count } = await TaskEntity.findAndCountAll({
      limit,
      offset,
      where: { assigneeId },
      include: [...this.joinUsersAndDepartments],
    });

    return { total: count, limit, offset, data: rows };
  }

  async getAuthored(query: PaginationDto, authorId: UserEntity['id']) {
    logger.info(`Чтение созданных задач для пользователя authorId=${authorId}`);
    const { limit, offset } = query;

    const { rows, count } = await TaskEntity.findAndCountAll({
      limit,
      offset,
      where: { authorId },
      include: [...this.joinUsersAndDepartments],
    });

    return { total: count, limit, offset, data: rows };
  }

  async getOne(id: TaskEntity['id']) {
    logger.info(`Чтение задачи id=${id}`);
    const task = await TaskEntity.findOne({
      where: { id },
      attributes: ['id', 'title', 'description', 'severity', 'createdAt'],
      include: [...this.joinUsersAndDepartments],
    });

    if (!task) {
      throw new NotFoundException(`Task with id [${id}] is not exist`);
    }

    return task;
  }

  async deleteOne(id: TaskEntity['id']) {
    logger.info(`Удаление задачи id=${id}`);
    await this.getOne(id);

    return TaskEntity.destroy({ where: { id } });
  }

  async update(id: TaskEntity['id'], dto: UpdateTaskDto) {
    logger.info(`Обновление задачи id=${id}`);

    await this.getOne(id);

    if (dto.assigneeId) {
      const assignee = await UserEntity.findOne({ where: { id: dto.assigneeId } });
      if (!assignee) {
        throw new NotFoundException(`User with id [${dto.assigneeId}] is not exist`);
      }
    }

    return TaskEntity.update(dto, { where: { id }, returning: true });
  }
}
