import * as Knex from 'knex';
import { Model } from 'objection';
import { UserProject } from '../users-projects';

export async function seed(knex: Knex): Promise<any> {
  Model.knex(knex);

  await UserProject.query().insert([
    { userId: 1, projectId: 1 },
    { userId: 1, projectId: 2 }
  ])
}
