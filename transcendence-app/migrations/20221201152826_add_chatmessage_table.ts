import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE
      IF NOT EXISTS ChatMessage (
        "id" UUID DEFAULT gen_random_uuid () PRIMARY KEY,
        "senderId" UUID NOT NULL REFERENCES Users (id) ON DELETE CASCADE,
        "recipientId" UUID NOT NULL REFERENCES Users (id) ON DELETE CASCADE,
        "content" TEXT NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW ()
      );
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP TABLE ChatMessage
  `);
}
