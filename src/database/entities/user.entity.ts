import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { UserRole } from '../../modules/user/user.types';
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

  @Column({ type: DataType.INTEGER, allowNull: true })
  public telegram: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: UserRole.user,
  })
  public role: UserRole;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  public active: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  public password: string;

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
