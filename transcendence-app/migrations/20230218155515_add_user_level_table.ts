import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
      CREATE TABLE
          IF NOT EXISTS UserLevel
      (
          "gameId"    UUID REFERENCES Game ("id") ON DELETE CASCADE,
          "username"  VARCHAR(20) NOT NULL REFERENCES Users (username) ON DELETE CASCADE ON UPDATE CASCADE,
          "level"     float8      NOT NULL,
          CHECK ("level" > 0),
          PRIMARY KEY ("gameId", "username")
      );
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP TABLE UserLevel
  `);
}
