import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // https://stackoverflow.com/a/48382296
  return knex.raw(`
    DO $$ BEGIN
      CREATE TYPE RoleType AS ENUM ('owner', 'moderator', 'banned');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP TYPE RoleType
  `);
}
