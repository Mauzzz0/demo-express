import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UserEntity } from './user.entity';

export enum TaskSeverity {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

@Table({ tableName: 'tasks' })
export class TaskEntity extends Model {
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
    type: DataType.STRING,
    allowNull: false,
    defaultValue: TaskSeverity.medium,
  })
  public severity: TaskSeverity;

  @ForeignKey(() => UserEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  public authorId: number;

  @BelongsTo(() => UserEntity, {
    as: 'author',
    foreignKey: 'authorId',
    onDelete: 'CASCADE',
  })
  public author: UserEntity;

  @ForeignKey(() => UserEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  public assigneeId: number;

  @BelongsTo(() => UserEntity, {
    as: 'assignee',
    foreignKey: 'assigneeId',
    onDelete: 'CASCADE',
  })
  public assignee: UserEntity;
}
