import * as Knex from 'knex';
import { Model } from 'objection';
import { Company } from '../companies';

export async function seed(knex: Knex): Promise<any> {
  Model.knex(knex);

  await Company.query().insert([
    { name: 'Name1', domain: 'Domain1' },
    { name: 'Name2', domain: 'Domain2' },
    { name: 'Name3', domain: 'Domain3' },
    { name: 'Name4', domain: 'Domain4' },
    { name: 'Name5', domain: 'Domain5' },
    { name: 'Name6', domain: 'Domain6' },
    { name: 'Name7', domain: 'Domain7' },
    { name: 'Name8', domain: 'Domain8' },
    { name: 'Name9', domain: 'Domain9' },
    { name: 'Name10', domain: 'Domain10' },
  ]);
}
