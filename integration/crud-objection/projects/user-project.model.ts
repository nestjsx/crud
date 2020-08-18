import * as path from 'path';
import { IsNotEmpty } from 'class-validator';
import { User } from '../users';
import { Model } from 'objection';
import { BaseModel } from '../base.model';
import { Project } from './index';

export class UserProject extends BaseModel {
  static tableName = 'users_projects';

  @IsNotEmpty()
  projectId: number;

  @IsNotEmpty()
  userId: number;

  review: string;

  /**
   * Relations
   */
  user?: User;
  project?: Project;

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.resolve(__dirname, '../users/user.model'),
      join: {
        from: 'users_projects.userId',
        to: 'users.id',
      },
    },
    project: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.resolve(__dirname, '../projects/project.model'),
      join: {
        from: 'users_projects.projectId',
        to: 'projects.id',
      },
    },
  };
}
