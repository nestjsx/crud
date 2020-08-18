import * as Knex from 'knex';

const tableName = 'devices';

export async function up(knex: Knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  return knex.schema.createTable(tableName, (t) => {
    t.uuid('device_key')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    t.text('description').nullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
