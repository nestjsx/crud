import { PrimaryKey, Column, DataType, CreatedAt, UpdatedAt, Model } from 'sequelize-typescript';
import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class BaseEntity extends Model {
  @Expose()
  @PrimaryKey
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  public id: number;

  @Expose()
  @CreatedAt public createdAt: Date;

  @Expose()
  @UpdatedAt public updatedAt: Date;
}
