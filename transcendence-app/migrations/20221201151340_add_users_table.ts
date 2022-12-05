import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE
      IF NOT EXISTS Users (
        "id" UUID DEFAULT gen_random_uuid () PRIMARY KEY,
        "username" VARCHAR(20) NOT NULL UNIQUE,
        "email" VARCHAR(50) NOT NULL,
        "fullName" VARCHAR(255) NOT NULL,
        "password" TEXT,
        "avatarId" UUID UNIQUE REFERENCES LocalFile (id) NOT NULL,
        "avatarX" SMALLINT NOT NULL DEFAULT 0,
        "avatarY" SMALLINT NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW ()
      )
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP TABLE Users
  `);
}
