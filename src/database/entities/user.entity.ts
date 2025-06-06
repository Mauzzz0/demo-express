import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { UserRole } from '../../modules/user/user.types';
import { DepartmentEntity } from './department.entity';
import { TaskEntity } from './task.entity';

@Table({ tableName: 'users' })
export class UserEntity extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
  public id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  public email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public password: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  public active: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: UserRole.user,
  })
  public role: UserRole;

  @Column({ type: DataType.INTEGER, allowNull: true })
  public telegram: number;

  @ForeignKey(() => DepartmentEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  public departmentId: number;

  @BelongsTo(() => DepartmentEntity, {
    as: 'department',
    foreignKey: 'departmentId',
  })
  public department: DepartmentEntity;

  @HasMany(() => TaskEntity, {
    as: 'authoredTasks',
    foreignKey: 'authorId',
  })
  public authoredTasks: TaskEntity[];

  @HasMany(() => TaskEntity, {
    as: 'assignedTasks',
    foreignKey: 'assigneeId',
  })
  public assignedTasks: TaskEntity[];
}
