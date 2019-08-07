import * as Knex from 'knex';

const tableName = 'companies';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, (t) => {
    t.increments();

    t.string('name', 100).notNullable();

    t.string('domain', 100)
      .notNullable()
      .unique();

    t.text('description').nullable();

    t.timestamps();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
