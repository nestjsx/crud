import * as Knex from 'knex';
import { Model } from 'objection';
import { UserLicense } from '../users-licenses';

export async function seed(knex: Knex): Promise<any> {
  Model.knex(knex);

  await UserLicense.query()
    .insert([
      { userId: 1, licenseId: 1, yearsActive: 3 },
      { userId: 1, licenseId: 2, yearsActive: 5 },
      { userId: 1, licenseId: 4, yearsActive: 7 },
      { userId: 2, licenseId: 5, yearsActive: 1 },
    ])
    .returning(['userId', 'licenseId']);
}
