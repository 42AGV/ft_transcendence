import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE
        IF NOT EXISTS Friend (
            "followerId" UUID REFERENCES Users (id) ON DELETE CASCADE,
            "followedId" UUID REFERENCES Users (id) ON DELETE CASCADE,
            CHECK ("followerId" != "followedId"),
            PRIMARY KEY ("followerId", "followedId")
        )
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP TABLE Friend
  `);
}
