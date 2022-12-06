import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE
      IF NOT EXISTS Moderators (
        "id" UUID REFERENCES Users (id) ON DELETE CASCADE,
        "owner" BOOLEAN NOT NULL DEFAULT false,
        PRIMARY KEY ("id")
      )
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP TABLE Moderators
  `);
}
