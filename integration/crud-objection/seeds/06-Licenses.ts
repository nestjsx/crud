import * as Knex from 'knex';
import { Model } from 'objection';
import { License } from '../users-licenses';

export async function seed(knex: Knex): Promise<any> {
  Model.knex(knex);

  await License.query().insert([
    { name: 'License1' },
    { name: 'License2' },
    { name: 'License3' },
    { name: 'License4' },
    { name: 'License5' },
  ]);
}
