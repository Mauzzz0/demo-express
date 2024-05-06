import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'tokens' })
export class TokenModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
  public id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public token: string;
}
