import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { UserModel } from './user.model';

@Table({ tableName: 'tokens' })
export class TokenModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
  public id: number;

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

  @Column({ type: DataType.STRING, allowNull: false })
  public token: string;
}
