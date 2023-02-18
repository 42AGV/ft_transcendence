import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE
        IF NOT EXISTS UserLevel (
            "username" VARCHAR(20) NOT NULL REFERENCES Users (username) ON DELETE CASCADE ON UPDATE CASCADE,
            "timestamp" TIMESTAMPTZ NOT NULL DEFAULT NOW (),
            "level" SMALLINT NOT NULL,
            "gameMode" TEXT NOT NULL,
            PRIMARY KEY ("username", "timestamp")
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP TABLE UserLevel
  `);
}
