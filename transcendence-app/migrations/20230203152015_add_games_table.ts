import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE
        IF NOT EXISTS Game (
            "id" UUID DEFAULT gen_random_uuid () PRIMARY KEY,
            "playerOneUsername" VARCHAR(20) NOT NULL REFERENCES Users (username) ON DELETE CASCADE,
            "playerTwoUsername" VARCHAR(20) NOT NULL REFERENCES Users (username) ON DELETE CASCADE,
            "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW (),
            "gameDuration" SMALLINT NOT NULL DEFAULT 0,
            "playerOneScore" SMALLINT NOT NULL DEFAULT 0,
            "playerTwoScore" SMALLINT NOT NULL DEFAULT 0,
            "gameMode" TEXT NOT NULL,
            CHECK ("playerOneUsername" != "playerTwoUsername")
        );
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP TABLE Game
  `);
}
