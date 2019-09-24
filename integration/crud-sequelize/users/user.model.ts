import {
  BelongsTo, BelongsToMany,
  Column,
  IsEmail,
  Model,
  Table,
  Unique
} from 'sequelize-typescript';
import Company from '../companies/company.model';
import Project from '../projects/project.model';
import UserProfile from '../user-profiles/user-profile.model';
import UserProject from './user-project.model';

@Table
export default class User extends Model<User> {
  @Unique
  @IsEmail
  @Column
  email: string;

  @Column
  isActive: boolean;

  @BelongsTo(() => UserProfile, 'profileId')
  profile?: UserProfile;

  @BelongsTo(() => Company, 'companyId')
  company?: Company;

  @BelongsToMany(() => Project, () => UserProject)
  projects?: Project[];
}
