import { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import { User } from '../src/user/infrastructure/db/user.entity';
import { createRandomAvatar, defaultUsernames } from './utils';

const CHATROOMS_NUMBER = 100;
const MESSAGES_PER_USER = 5;

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
  // Create chatroom seed entries
  const avatars = await Promise.all(
    Array.from({ length: CHATROOMS_NUMBER }, createRandomAvatar),
  );
  const users = await knex
    .select('*')
    .from('users')
    .whereIn('username', defaultUsernames);
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
  await knex('chatroommembers').insert(
    owners.map((owner) => ({ ...owner, admin: true })),
  );

  // Insert chatroom members seed entries
  const chatroomsAndDefaultUsers = await knex
    .select('chatroom.id as chatId', 'users.id as userId')
    .from('chatroom')
    .crossJoin('users' as any)
    .whereIn('users.username', defaultUsernames);
  await knex('chatroommembers')
    .insert(chatroomsAndDefaultUsers)
    .onConflict(['chatId', 'userId'])
    .ignore();

  // Insert chatroom messages seed entries
  const messages = chatroomsAndDefaultUsers.reduce((accumulator, current) => {
    const memberMessages = Array.from({ length: MESSAGES_PER_USER }, () =>
      createRandomChatroomMessage(current.chatId, current.userId),
    );
    return [...accumulator, ...memberMessages];
  }, []);
  await knex('chatroommessage').insert(messages);
}
