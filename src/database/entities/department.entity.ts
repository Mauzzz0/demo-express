import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { UserEntity } from './user.entity';

@Table({ tableName: 'departments' })
export class DepartmentEntity extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
  public id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public title: string;

  @HasMany(() => UserEntity, {
    as: 'employees',
    foreignKey: 'departmentId',
  })
  public employees: UserEntity[];
}
