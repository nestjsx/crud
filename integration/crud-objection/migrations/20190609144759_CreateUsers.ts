import * as Knex from 'knex';

const tableName = 'users';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, (t) => {
    t.increments();

    t.string('email', 255)
      .notNullable()
      .unique();

    t.boolean('is_active')
      .notNullable()
      .defaultTo(true);

    t.integer('company_id')
      .notNullable()
      .references('id')
      .inTable('companies');

    t.integer('profile_id').unsigned();
    t.foreign('profile_id')
      .references('id')
      .inTable('user_profiles')
      .onDelete('CASCADE');

    t.timestamps();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
