import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    ALTER TABLE Users
      ADD COLUMN "level" SMALLINT NOT NULL DEFAULT 1
    `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    ALTER TABLE Users
      DROP COLUMN "level"
    `);
}
