import { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import { rmSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { LocalFileService } from '../src/shared/local-file/local-file.service';
import { EnvironmentVariables } from '../src/config/env.validation';
import { ILocalFileRepository } from '../src/shared/local-file/infrastructure/db/local-file.repository';
import { LocalFilePostgresRepository } from '../src/shared/local-file/infrastructure/db/postgres/local-file.postgres.repository';
import { PostgresPool } from '../src/shared/db/postgres/postgresConnection.provider';
import { User } from '../src/user/infrastructure/db/user.entity';

config({ path: `.env.${process.env.NODE_ENV}` });

const configService = new ConfigService<EnvironmentVariables>();
const CHATROOMS_NUMBER = 100;
const MESSAGES_PER_USER = 5;

const createRandomAvatar = async () => {
  const postgresPool = new PostgresPool(configService);
  const localFileRepository: ILocalFileRepository =
    new LocalFilePostgresRepository(postgresPool);
  const localFileService = new LocalFileService(
    configService,
    localFileRepository,
  );
  const avatarDto = await localFileService.createRandomSVGFile(12, 512);

  return { id: uuidv4(), ...avatarDto };
};

const createRandomChatroom = (user: User, avatarId: string) => {
  const name = faker.helpers.unique(faker.random.words);
  return {
    name: `${name} (${user.username})`,
    ownerId: user.id,
    avatarId,
  };
};

const createRandomChatroomMessage = (chatroomId: string, userId: string) => {
  return {
    chatroomId,
    userId,
    content: faker.lorem.lines(),
  };
};

export async function seed(knex: Knex): Promise<void> {
  // Save avatar data to delete later
  const avatarsData = await knex
    .select('localfile.id', 'localfile.path')
    .from('chatroom')
    .innerJoin('localfile', 'chatroom.avatarId', 'localfile.id');

  // Deletes ALL existing entries and local files
  await knex('chatroom').del();
  for (let i = 0; i < avatarsData.length; i++) {
    await knex('localfile').where('id', avatarsData[i].id).del();
    rmSync(avatarsData[i].path, {
      recursive: true,
      force: true,
    });
  }

  // Create chatroom seed entries
  const avatars = await Promise.all(
    Array.from({ length: CHATROOMS_NUMBER }, createRandomAvatar),
  );
  const usernames = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const users = await knex
    .select('*')
    .from('users')
    .whereIn('username', usernames);
  const getRandomUser = () => users[Math.floor(Math.random() * users.length)];
  const chatrooms = avatars.map((avatar) =>
    createRandomChatroom(getRandomUser(), avatar.id),
  );

  // Inserts chatrooms seed entries
  await knex('localfile').insert(avatars);
  await knex('chatroom').insert(chatrooms);
  const owners = await knex
    .select('id as chatId', 'ownerId as userId')
    .from('chatroom');
  await knex('chatroommembers').insert(owners);

  // Insert chatroom members seed entries
  const chatroomsAndUsers = await knex
    .select('chatroom.id as chatId', 'users.id as userId')
    .from('chatroom')
    .crossJoin('users' as any)
    .whereIn('users.username', usernames);
  await knex('chatroommembers')
    .insert(chatroomsAndUsers)
    .onConflict(['chatId', 'userId'])
    .ignore();

  // Insert chatroom messages seed entries
  const messages = chatroomsAndUsers.reduce((accumulator, current) => {
    const memberMessages = Array.from({ length: MESSAGES_PER_USER }, () =>
      createRandomChatroomMessage(current.chatId, current.userId),
    );
    return [...accumulator, ...memberMessages];
  }, []);
  await knex('chatroommessage').insert(messages);
}
