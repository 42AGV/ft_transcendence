import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE
      IF NOT EXISTS ChatroomMessage (
        "id" UUID DEFAULT gen_random_uuid () PRIMARY KEY,
        "chatroomId" UUID NOT NULL REFERENCES Chatroom (id) ON DELETE CASCADE,
        "userId" UUID NOT NULL REFERENCES Users (id) ON DELETE CASCADE,
        "content" TEXT NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW ()
      )
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP TABLE ChatroomMessage
  `);
}
