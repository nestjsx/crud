import { Table, Model, Column, PrimaryKey, DataType, AllowNull } from 'sequelize-typescript';
import { Exclude, Expose } from 'class-transformer';
import { BaseEntity } from '../base-entity';

@Exclude()
@Table({})
export class Note extends BaseEntity {
  @Expose()
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  revisionId: number;
}
