import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { UserModel } from './user.model';

enum TaskSeverity {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

@Table({ tableName: 'tasks' })
export class TaskModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
  public id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public title: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public description: string;

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    defaultValue: TaskSeverity.medium,
    values: Object.values(TaskSeverity),
  })
  public severity: TaskSeverity;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  public authorId: number;

  @BelongsTo(() => UserModel, {
    as: 'author',
    foreignKey: 'authorId',
    onDelete: 'CASCADE',
  })
  public author: UserModel;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  public assigneeId: number;

  @BelongsTo(() => UserModel, {
    as: 'assignee',
    foreignKey: 'assigneeId',
    onDelete: 'CASCADE',
  })
  public assignee: UserModel;
}
