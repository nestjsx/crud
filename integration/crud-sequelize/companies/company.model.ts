import { CrudValidationGroups } from '@nestjsx/crud';
import { Table, Column, AllowNull, Length, DataType, Unique, HasMany } from 'sequelize-typescript';

import { BaseEntity } from '../base-entity';
import { User } from '../users/user.model';
import { Project } from '../projects/project.model';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
@Table({})
export class Company extends BaseEntity {
  @Expose()
  @AllowNull(false)
  @Length({ min: 1, max: 100 })
  @Column({ type: DataType.STRING })
  name: string;

  @Expose()
  @AllowNull(false)
  @Length({ min: 1, max: 100 })
  @Unique
  @Column({ type: DataType.STRING })
  domain: string;

  @Expose()
  @AllowNull(true)
  @Column({ type: DataType.TEXT, defaultValue: null })
  description: string;

  /**
   * Relations
   */
  @Expose()
  @HasMany(() => User, { foreignKey: 'companyId', onDelete: 'CASCADE' })
  users: User[];

  @Expose()
  @HasMany(() => Project, { foreignKey: 'companyId', onDelete: 'CASCADE' })
  projects: Project[];
}
