import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';

import { TaskModel } from './task.model';

@Table({ tableName: 'users' })
export class UserModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
  public id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public nick: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public password: string;

  @HasMany(() => TaskModel, {
    as: 'tasks',
  })
  public tasks: TaskModel[];
}
