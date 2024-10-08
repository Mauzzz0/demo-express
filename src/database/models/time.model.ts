import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { TaskModel } from './task.model';
import { UserModel } from './user.model';

type Interval = {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
};

@Table({ tableName: 'times' })
export class TimeModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
  public id: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  public date: string;

  @Column({
    type: 'INTERVAL',
    allowNull: false,
  })
  public time: Interval;

  @ForeignKey(() => TaskModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  public taskId: number;

  @BelongsTo(() => TaskModel, {
    as: 'task',
    foreignKey: 'taskId',
    onDelete: 'CASCADE',
  })
  public task: TaskModel;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  public userId: number;

  @BelongsTo(() => UserModel, {
    as: 'user',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  })
  public user: UserModel;
}
