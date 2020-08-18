import * as Knex from 'knex';

const tableName = 'user_profiles';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, (t) => {
    t.increments();

    t.string('name', 32).nullable();

    t.timestamps();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
