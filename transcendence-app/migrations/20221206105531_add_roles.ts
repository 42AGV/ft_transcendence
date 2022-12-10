import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('roles').insert({ name: 'owner' });
  await knex('roles').insert({ name: 'moderator' });
  await knex('roles').insert({ name: 'banned' });
}

export async function down(knex: Knex): Promise<void> {
  await knex('roles').where('name', 'owner').delete();
  await knex('roles').where('name', 'moderator').delete();
  await knex('roles').where('name', 'banned').delete();
}
