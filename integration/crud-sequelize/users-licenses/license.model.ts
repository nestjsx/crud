import { BaseEntity } from '../base-entity';
import { Table, Column, DataType, AllowNull } from 'sequelize-typescript';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
@Table({})
export class License extends BaseEntity {
  @Expose()
  @AllowNull(true)
  @Column({ type: DataType.STRING(32), defaultValue: null })
  name: string;
}
