import { AllowNull, BelongsTo, BelongsToMany, Column, Model, Table, Unique } from 'sequelize-typescript';
import Company from '../companies/company.model';
import UserProject from '../users/user-project.model';
import User from '../users/user.model';

@Table({})
export default class Project extends Model<Project> {
  @Unique
  @AllowNull(false)
  @Column
  name?: string;

  @Column
  description?: string;

  @Column
  isActive?: boolean;

  @BelongsTo(() => Company, 'companyId')
  company: Company;

  @BelongsToMany(() => User, () => UserProject)
  users: User[];
}
