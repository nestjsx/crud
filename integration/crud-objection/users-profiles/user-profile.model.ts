import * as path from 'path';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { User } from '../users';
import { Model } from 'objection';
import { BaseModel } from '../base.model';

export class UserProfile extends BaseModel {
  static tableName = 'user_profiles';

  @IsOptional({ always: true })
  @IsString({ always: true })
  @MaxLength(32, { always: true })
  name: string;

  /**
   * Relations
   */
  user?: User;

  static relationMappings = {
    user: {
      relation: Model.HasOneRelation,
      modelClass: path.resolve(__dirname, '../users/user.model'),
      join: {
        from: 'user_profiles.id',
        to: 'users.profileId',
      },
    },
  };
}
