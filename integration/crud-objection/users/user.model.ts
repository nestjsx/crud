import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CrudValidationGroups } from '@nestjsx/crud';

import { UserProfile } from '../users-profiles';
import { Company } from '../companies';
import { Project, UserProject } from '../projects';
import * as path from 'path';
import { Model } from 'objection';
import { BaseModel } from '../base.model';
import { UserLicense } from '../users-licenses';

const { CREATE, UPDATE } = CrudValidationGroups;

export class Name {
  @IsString({ always: true })
  first: string;

  @IsString({ always: true })
  last: string;
}

export class User extends BaseModel {
  static tableName = 'users';

  static get jsonAttributes() {
    return ['name'];
  }

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

  @Type((t) => Name)
  name: Name;

  profileId?: number;

  companyId?: number;

  /**
   * Relations
   */
  @ValidateNested({ always: true })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Type((t) => UserProfile)
  profile?: Partial<UserProfile>;

  company?: Company;

  projects?: Project[];

  userProjects?: UserProject[];
  userLicenses?: UserLicense[];

  static relationMappings = {
    profile: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.resolve(__dirname, '../users-profiles/user-profile.model'),
      join: {
        from: 'users.profileId',
        to: 'user_profiles.id',
      },
    },
    company: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.resolve(__dirname, '../companies/company.model'),
      join: {
        from: 'users.companyId',
        to: 'companies.id',
      },
    },
    projects: {
      relation: Model.ManyToManyRelation,
      modelClass: path.resolve(__dirname, '../projects/project.model'),
      join: {
        from: 'users.id',
        through: {
          from: 'users_projects.userId',
          to: 'users_projects.projectId',
        },
        to: 'projects.id',
      },
    },
    userProjects: {
      relation: Model.HasManyRelation,
      modelClass: path.resolve(__dirname, '../projects/user-project.model'),
      join: {
        from: 'users.id',
        to: 'users_projects.userId',
      },
    },
    userLicenses: {
      relation: Model.HasManyRelation,
      modelClass: path.resolve(__dirname, '../users-licenses/user-license.model'),
      join: {
        from: 'users.id',
        to: 'users_licenses.userId',
      },
    },
  };
}
