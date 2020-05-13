import { CrudValidationGroups } from '@nestjsx/crud';
import { Table, PrimaryKey, Column, DataType, AllowNull, Model } from 'sequelize-typescript';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
@Table({})
export class Device extends Model<Device> {
  @Expose()
  @PrimaryKey
  @Column({
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  deviceKey: string;

  @Expose()
  @AllowNull(true)
  @Column({ type: DataType.STRING })
  description: string;
}
