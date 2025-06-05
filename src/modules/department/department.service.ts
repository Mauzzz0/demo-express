import { injectable } from 'inversify';
import { DepartmentEntity } from '../../database/entities/department.entity';
import { NotFoundException } from '../../exceptions';
import { CreateDepartmentBodyDto } from './dto';

@injectable()
export class DepartmentService {
  async create(dto: CreateDepartmentBodyDto) {
    return DepartmentEntity.create({ title: dto.title });
  }

  async getAll() {
    return DepartmentEntity.findAll({
      order: [['id', 'asc']],
    });
  }

  async deleteOne(id: DepartmentEntity['id']) {
    const department = await DepartmentEntity.findByPk(id);

    if (!department) {
      throw new NotFoundException(`Department with id [${id}] is not exist`);
    }

    return DepartmentEntity.destroy({ where: { id } });
  }
}
