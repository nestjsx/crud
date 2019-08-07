import { IsBoolean, IsDefined, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseModel } from '../base.model';
import * as path from 'path';
import { Model } from 'objection';
import { Company } from '../companies';
import { User } from '../users';

const { CREATE, UPDATE } = CrudValidationGroups;

export class Project extends BaseModel {
  static tableName = 'projects';

  @IsOptional({ groups: [UPDATE] })
  @IsDefined({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(100, { always: true })
  name?: string;

  @IsOptional({ always: true })
  description?: string;

  @IsOptional({ always: true })
  @IsBoolean({ always: true })
  isActive?: boolean;

  @IsOptional({ always: true })
  @IsNumber({}, { always: true })
  companyId?: number;

  /**
   * Relations
   */

  users?: User[];
  company?: Company;

  static relationMappings = {
    company: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.resolve(__dirname, '../companies/company.model'),
      join: {
        from: 'projects.companyId',
        to: 'companies.id'
      }
    },
    users: {
      relation: Model.ManyToManyRelation,
      modelClass: path.resolve(__dirname, '../users/user.model'),
      join: {
        from: 'projects.id',
        through: {
          from: 'users_projects.projectId',
          to: 'users_projects.userId'
        },
        to: 'users.id'
      }
    }
  }
}
