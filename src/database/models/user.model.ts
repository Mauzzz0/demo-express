import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { TaskModel } from './task.model';

export enum UserRole {
  user = 'user',
  admin = 'admin',
}

@Table({ tableName: 'users' })
export class UserModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
  public id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: false })
  public nick: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  public email: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  public telegram: number;

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    defaultValue: UserRole.user,
    values: Object.values(UserRole),
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

  @HasMany(() => TaskModel, {
    as: 'authoredTasks',
    foreignKey: 'authorId',
  })
  public authoredTasks: TaskModel[];

  @HasMany(() => TaskModel, {
    as: 'assignedTasks',
    foreignKey: 'assigneeId',
  })
  public assignedTasks: TaskModel[];
}
