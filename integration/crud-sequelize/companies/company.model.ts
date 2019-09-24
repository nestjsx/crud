import {
  AllowNull,
  Column,
  HasMany,
  Model,
  Table,
  Unique
} from 'sequelize-typescript';
import Project from '../projects/project.model';
import User from '../users/user.model';

@Table({})
export default class Company extends Model<Company> {
  @AllowNull(false)
  @Column
  name: string;

  @Unique
  @Column
  domain: string;

  @Column
  description: string;

  @HasMany(() => User, 'companyId')
  users: User[];

  @HasMany(() => Project, 'companyId')
  projects: Project[];
}
