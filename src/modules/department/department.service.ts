import { injectable } from 'inversify';
import { DepartmentEntity } from '../../database/entities/department.entity';
import { NotFoundException } from '../../exceptions';
import logger from '../../logger';
import { CreateDepartmentBodyDto } from './dto';

@injectable()
export class DepartmentService {
  async create(dto: CreateDepartmentBodyDto) {
    logger.info(`Создание нового департамента "${dto.title}"`);

    return DepartmentEntity.create({ title: dto.title });
  }

  async getAll() {
    logger.info('Чтение списка департаментов');

    return DepartmentEntity.findAll({
      order: [['id', 'asc']],
    });
  }

  async deleteOne(id: DepartmentEntity['id']) {
    const department = await DepartmentEntity.findByPk(id);

    if (!department) {
      throw new NotFoundException(`Department with id [${id}] is not exist`);
    }

    logger.info(`Удаление департамента (${department.id}) "${department.title}"`);

    return DepartmentEntity.destroy({ where: { id } });
  }
}
