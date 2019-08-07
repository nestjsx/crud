import * as Knex from 'knex';

const tableName = 'projects';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, (t) => {
    t.increments();

    t.string('name', 100)
      .notNullable()
      .unique();

    t.text('description').nullable();

    t.boolean('is_active')
      .notNullable()
      .defaultTo(true);

    t.integer('company_id')
      .notNullable()
      .references('id')
      .inTable('companies');

    t.timestamps();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
