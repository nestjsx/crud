import * as Knex from 'knex';
import { Model } from 'objection';
import { Note } from '../notes';

export async function seed(knex: Knex): Promise<any> {
  Model.knex(knex);

  await Note.query().insert([
    { revisionId: 1 },
    { revisionId: 1 },
    { revisionId: 2 },
    { revisionId: 2 },
    { revisionId: 3 },
    { revisionId: 3 },
  ]);
}
