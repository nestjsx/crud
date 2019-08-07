import * as path from 'path';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';

import { User } from '../users/user.model';
import { Project } from '../projects/project.model';
import { BaseModel } from '../base.model';
import { Model } from 'objection';
import { Type } from 'class-transformer';

const { CREATE, UPDATE } = CrudValidationGroups;

export class Company extends BaseModel {
  static tableName = 'companies';

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(100, { always: true })
  name: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ groups: [CREATE, UPDATE] })
  @MaxLength(100, { groups: [CREATE, UPDATE] })
  domain: string;

  @IsOptional({ always: true })
  @IsString({ always: true })
  description: string;

  /**
   * Relations
   */

  @Type((t) => User)
  users?: User[];
  projects?: Project[];

  static relationMappings = {
    users: {
      relation: Model.HasManyRelation,
      modelClass: path.resolve(__dirname, '../users/user.model'),
      join: {
        from: 'companies.id',
        to: 'users.companyId'
      }
    },
    projects: {
      relation: Model.HasManyRelation,
      modelClass: path.resolve(__dirname, '../projects/project.model'),
      join: {
        from: 'companies.id',
        to: 'projects.companyId'
      }
    }
  }
}
