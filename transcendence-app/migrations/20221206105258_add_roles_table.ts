import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
      CREATE TABLE
          IF NOT EXISTS Roles
      (
          "name" VARCHAR(20) NOT NULL UNIQUE PRIMARY KEY
      )
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
      DROP TABLE Roles
  `);
}
