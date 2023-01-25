import { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import { User } from '../src/user/infrastructure/db/user.entity';
import { createRandomAvatar, defaultUsernames } from './utils';

const CHATROOMS_NUMBER = 20;
const MESSAGES_PER_USER = 2;
const EXTRA_CHATROOM_MEMBERS = 10;

const createRandomChatroom = (user: User, avatarId: string) => {
  const name = faker.helpers.unique(faker.random.words);
  return {
    name: `${name} (${user.username})`,
    ownerId: user.id,
    avatarId,
  };
};

let startTime = new Date(Date.now());

const createRandomChatroomMessage = (chatroomId: string, userId: string) => {
  const oldDate = startTime;
  startTime.setSeconds(1 + startTime.getSeconds());
  return {
    chatroomId,
    userId,
    content: faker.lorem.lines(),
    createdAt: oldDate,
  };
};

const seedChatrooms = async (knex: Knex) => {
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
};

const seedDefaultChatroomMembers = async (knex: Knex) => {
  // Select chatrooms and default users
  const chatroomsAndDefaultUsers = await knex
    .select('chatroom.id as chatId', 'users.id as userId')
    .from('chatroom')
    .crossJoin('users' as any)
    .whereIn('users.username', defaultUsernames);

  // Insert the default chatroom members seed entries
  await knex('chatroommembers')
    .insert(chatroomsAndDefaultUsers)
    .onConflict(['chatId', 'userId'])
    .ignore();
};

const seedChatroomMessages = async (knex: Knex) => {
  const chatroomsAndDefaultUsers = await knex
    .select('chatroom.id as chatId', 'users.id as userId')
    .from('chatroom')
    .crossJoin('users' as any)
    .whereIn('users.username', defaultUsernames);

  // Insert chatroom messages seed entries
  const messages = chatroomsAndDefaultUsers.reduce((accumulator, current) => {
    const memberMessages = Array.from({ length: MESSAGES_PER_USER }, () =>
      createRandomChatroomMessage(current.chatId, current.userId),
    );
    return [...accumulator, ...memberMessages];
  }, []);
  await knex('chatroommessage').insert(messages);
};

const seedExtraChatroomMembers = async (knex: Knex) => {
  // Select extra users and chatrooms
  const usersAndChatrooms = await knex
    .with('extra_users', (queryBuilder) => {
      queryBuilder
        .select('*')
        .from('users')
        .whereNotIn('users.username', defaultUsernames)
        .orderBy('users.id')
        .limit(EXTRA_CHATROOM_MEMBERS);
    })
    .select('chatroom.id as chatId', 'extra_users.id as userId')
    .from('extra_users')
    .crossJoin('chatroom' as any);

  // Insert the chatroom members seed entries
  await knex('chatroommembers')
    .insert(usersAndChatrooms)
    .onConflict(['chatId', 'userId'])
    .ignore();
};

export async function seed(knex: Knex): Promise<void> {
  await seedChatrooms(knex);
  await seedDefaultChatroomMembers(knex);
  await seedChatroomMessages(knex);
  await seedExtraChatroomMembers(knex);
}
