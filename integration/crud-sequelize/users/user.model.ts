import { CrudValidationGroups } from '@nestjsx/crud';

import { BaseEntity } from '../base-entity';
import { UserProfile } from '../users-profiles/userprofile.model';
import { UserLicense } from '../users-licenses/userlicense.model';
import { Company } from '../companies/company.model';
import { Project } from '../projects/project.model';
import { UserProject } from '../projects/userproject.model';
import { Table, DataType, Column, BelongsTo, BelongsToMany, HasMany, AllowNull, ForeignKey, Model, PrimaryKey, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { Exclude, Expose } from 'class-transformer';

const { CREATE, UPDATE } = CrudValidationGroups;

@Exclude()
@Table({})
export class User extends BaseEntity {
  @Expose()
  @Column({ type: DataType.STRING(255), unique: true })
  email: string;

  @Expose()
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @Expose()
  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  companyId: number;

  @Expose()
  @ForeignKey(() => UserProfile)
  @Column({ type: DataType.INTEGER })
  profileId: number;

  /**
   * Relations
   */

  @Expose()
  @BelongsTo(() => UserProfile, { foreignKey: 'profileId' })
  profile: UserProfile;

  @Expose()
  @BelongsTo(() => Company, 'companyId')
  company: Company;

  @Expose()
  @BelongsToMany(() => Project, { through: () => UserProject })
  projects: Project[];

  @Expose()
  @HasMany(() => UserProject, { onDelete: 'CASCADE' })
  userProjects: UserProject[];

  @Expose()
  @HasMany(() => UserLicense, { onDelete: 'CASCADE' })
  userLicenses: UserLicense[];
}
