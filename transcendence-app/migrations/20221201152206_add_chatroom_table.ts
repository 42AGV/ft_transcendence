import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE
      IF NOT EXISTS Chatroom (
        "id" UUID DEFAULT gen_random_uuid () PRIMARY KEY,
        "name" VARCHAR(100) NOT NULL UNIQUE,
        "password" TEXT,
        "avatarId" UUID NOT NULL REFERENCES LocalFile (id) UNIQUE,
        "avatarX" SMALLINT NOT NULL DEFAULT 0,
        "avatarY" SMALLINT NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        "ownerId" UUID NOT NULL REFERENCES Users (id) ON DELETE CASCADE
      )
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP TABLE Chatroom
  `);
}
