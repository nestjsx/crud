import * as Knex from 'knex';

const tableName = 'users_projects';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, (t) => {
    t.increments();

    t.integer('user_id').unsigned();
    t.foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    t.integer('project_id').unsigned();
    t.foreign('project_id')
      .references('id')
      .inTable('projects')
      .onDelete('CASCADE');

    t.unique(['user_id', 'project_id']);

    t.timestamps();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
