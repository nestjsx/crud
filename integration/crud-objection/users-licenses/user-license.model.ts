import { Type } from 'class-transformer';
import { License } from './license.model';
import { Model } from 'objection';
import * as path from 'path';
import { User } from '../users';

export class UserLicense extends Model {
  static readonly tableName = 'users_licenses';
  static readonly idColumn = ['userId', 'licenseId'];

  userId: number;
  licenseId: number;

  yearsActive: number;

  @Type((t) => User)
  user: User;

  @Type((t) => License)
  license: License;

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.resolve(__dirname, '../users/user.model'),
      join: {
        from: 'users_licenses.userId',
        to: 'users.id',
      },
    },
    license: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.resolve(__dirname, '../users-licenses/license.model'),
      join: {
        from: 'users_licenses.licenseId',
        to: 'licenses.id',
      },
    },
  };
}
