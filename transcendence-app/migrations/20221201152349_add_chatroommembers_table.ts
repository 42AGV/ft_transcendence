import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE
      IF NOT EXISTS ChatroomMembers (
        "chatId" UUID REFERENCES Chatroom (id) ON DELETE CASCADE,
        "userId" UUID REFERENCES Users (id) ON DELETE CASCADE,
        "joinedAt" TIMESTAMPTZ DEFAULT NOW (),
        "admin" BOOLEAN NOT NULL DEFAULT false,
        "muted" BOOLEAN NOT NULL DEFAULT false,
        "banned" BOOLEAN NOT NULL DEFAULT false,
        PRIMARY KEY ("chatId", "userId")
      )
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP TABLE ChatroomMembers
  `);
}
