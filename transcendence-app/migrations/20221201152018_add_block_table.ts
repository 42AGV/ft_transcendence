import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE
      IF NOT EXISTS Block (
        "blockerId" UUID REFERENCES Users (id) ON DELETE CASCADE,
        "blockedId" UUID REFERENCES Users (id) ON DELETE CASCADE,
        CHECK ("blockerId" != "blockedId"),
        PRIMARY KEY ("blockerId", "blockedId")
      )
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP TABLE Block
  `);
}
