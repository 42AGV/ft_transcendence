import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE
      IF NOT EXISTS LocalFile (
        "id" UUID DEFAULT gen_random_uuid () PRIMARY KEY,
        "filename" VARCHAR(100) NOT NULL UNIQUE,
        "path" VARCHAR(255) NOT NULL UNIQUE,
        "mimetype" VARCHAR(255) NOT NULL,
        "size" BIGINT NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW ()
      )
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP TABLE LocalFile
  `);
}
