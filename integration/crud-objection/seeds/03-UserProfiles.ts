import * as Knex from 'knex';
import { Model } from 'objection';
import { UserProfile } from '../users-profiles';

export async function seed(knex: Knex): Promise<any> {
  Model.knex(knex);

  await UserProfile.query().insert([
    { name: 'User1' },
    { name: 'User2' },
    { name: 'User3' },
    { name: 'User4' },
    { name: 'User5' },
    { name: 'User6' },
    { name: 'User7' },
    { name: 'User8' },
    { name: 'User9' },
    { name: 'User1' },
    { name: 'User1' },
    { name: 'User1' },
    { name: 'User1' },
    { name: 'User1' },
    { name: 'User1' },
    { name: 'User1' },
    { name: 'User1' },
    { name: 'User1' },
    { name: 'User1' },
    { name: 'User2' },
  ]);
}
