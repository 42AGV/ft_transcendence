import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
      CREATE TABLE
          IF NOT EXISTS UserToRole
      (
          "id"   UUID REFERENCES Users (id) ON DELETE CASCADE,
          "role" VARCHAR(20) REFERENCES Roles (name) ON DELETE CASCADE,
          PRIMARY KEY ("id", "role")
      )
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
      DROP TABLE UserToRole
  `);
}
