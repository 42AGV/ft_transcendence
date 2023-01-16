import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    ALTER TABLE Users
      ADD COLUMN "isTwoFactorAuthenticationEnabled" BOOLEAN NOT NULL DEFAULT false
    `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    ALTER TABLE Users
      DROP COLUMN "isTwoFactorAuthenticationEnabled"
    `);
}
