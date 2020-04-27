import { CrudValidationGroups } from '@nestjsx/crud';

import { BaseEntity } from '../base-entity';
import { Company } from '../companies/company.model';
import { User } from '../users/user.model';
import { UserProject } from './userproject.model';
import { Table, Column, DataType, AllowNull, HasMany, BelongsToMany, BelongsTo } from 'sequelize-typescript';
import { Expose, Exclude } from 'class-transformer';

@Exclude()
@Table({})
export class Project extends BaseEntity {
  @Expose()
  @Column({ type: DataType.STRING, unique: true })
  name: string;

  @Expose()
  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  description: string;

  @Expose()
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @Expose()
  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  companyId: number;

  /**
   * Relations
   */

  @Expose()
  @BelongsTo(() => Company, 'companyId')
  company: Company;

  @Expose()
  @BelongsToMany(() => User, () => UserProject)
  users: User[];

  @Expose()
  @HasMany(() => UserProject, { foreignKey: 'projectId', onDelete: 'CASCADE' } )
  userProjects: UserProject[];
}
