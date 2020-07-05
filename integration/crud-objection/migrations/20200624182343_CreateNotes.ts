import * as Knex from 'knex';

const tableName = 'notes';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, (t) => {
    t.increments();

    t.integer('revision_id').notNullable();

    t.timestamps();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
