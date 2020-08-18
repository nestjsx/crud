import * as Knex from 'knex';
import { Model } from 'objection';
import { UserProject } from '../projects';

export async function seed(knex: Knex): Promise<any> {
  Model.knex(knex);

  await UserProject.query().insert([
    { projectId: 1, userId: 1, review: 'User project 1 1' },
    { projectId: 1, userId: 2, review: 'User project 1 2' },
    { projectId: 2, userId: 2, review: 'User project 2 2' },
    { projectId: 3, userId: 3, review: 'User project 3 3' },
  ]);
}
