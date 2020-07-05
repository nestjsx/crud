import * as Knex from 'knex';

const tableName = 'users_licenses';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, (t) => {
    t.integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    t.integer('license_id')
      .references('id')
      .inTable('licenses')
      .onDelete('CASCADE');

    t.primary(['user_id', 'license_id']);

    t.integer('years_active').notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
