import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    ALTER TABLE Users
      ADD COLUMN "twoFactorAuthenticationSecret" TEXT
    `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    ALTER TABLE Users
      DROP COLUMN "twoFactorAuthenticationSecret"
    `);
}
