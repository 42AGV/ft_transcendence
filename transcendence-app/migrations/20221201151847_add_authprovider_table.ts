import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE
      IF NOT EXISTS AuthProvider (
        "providerId" TEXT NOT NULL,
        "provider" ProviderType NOT NULL,
        "userId" UUID NOT NULL REFERENCES Users (id) ON DELETE CASCADE,
        PRIMARY KEY ("providerId", "provider")
      )
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP TABLE AuthProvider
  `);
}
