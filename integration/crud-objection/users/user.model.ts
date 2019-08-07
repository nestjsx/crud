import {
  IsOptional,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CrudValidationGroups } from '@nestjsx/crud';

import { UserProfile } from '../users-profiles/user-profile.model';
import { Company } from '../companies/company.model';
import { Project } from '../projects/project.model';
import * as path from "path";
import { Model } from 'objection';
import { BaseModel } from '../base.model';

const { CREATE, UPDATE } = CrudValidationGroups;

export class User extends BaseModel {
  static tableName = 'users';

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(255, { always: true })
  @IsEmail({ require_tld: false }, { always: true })
  email: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsBoolean({ always: true })
  isActive: boolean;

  profileId?: number;

  companyId?: number;

  /**
   * Relations
   */
  @ValidateNested({ always: true })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Type(t => UserProfile)
  profile?: Partial<UserProfile>;

  company?: Company;

  projects?: Project[];

  static relationMappings = {
    profile: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.resolve(__dirname, '../users-profiles/user-profile.model'),
      join: {
        from: 'users.profileId',
        to: 'user_profiles.id'
      }
    },
    company: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.resolve(__dirname, '../companies/company.model'),
      join: {
        from: 'users.companyId',
        to: 'companies.id'
      }
    },
    projects: {
      relation: Model.ManyToManyRelation,
      modelClass: path.resolve(__dirname, '../projects/project.model'),
      join: {
        from: 'users.id',
        through: {
          from: 'users_projects.userId',
          to: 'users_projects.projectId'
        },
        to: 'projects.id'
      }
    }
  }
}
