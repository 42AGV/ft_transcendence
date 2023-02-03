import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE
        IF NOT EXISTS Game (
            "id" UUID DEFAULT gen_random_uuid () PRIMARY KEY,
            "playerOneId" UUID REFERENCES Users (id) ON DELETE CASCADE,
            "playerTwoId" UUID REFERENCES Users (id) ON DELETE CASCADE,
            "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW (),
            "gameDuration" SMALLINT NOT NULL DEFAULT 0,
            "playerOneScore" SMALLINT NOT NULL DEFAULT 0,
            "playerTwoScore" SMALLINT NOT NULL DEFAULT 0,
            "gameMode" TEXT NOT NULL,
            CHECK ("playerOneId" != "playerTwoId")
        );
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP TABLE Game
  `);
}
