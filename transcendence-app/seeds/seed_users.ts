import { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import { join } from 'path';
import { rmSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

import { AVATARS_PATH } from '../src/user/constants';
import createRandomAvatarFile from '../src/shared/utilities/randomAvatarFile';

const USERS_NUMBER = 5000;

const createRandomAvatar = async () => {
  const avatarDto = await createRandomAvatarFile(12, 512);

  return { id: uuidv4(), ...avatarDto };
};

const createRandomUser = (avatarId: string) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const username = faker.helpers.unique(faker.internet.userName, [
    firstName,
    lastName,
  ]);
  return {
    username: username.slice(-20),
    email: faker.internet.email(firstName, lastName).slice(-50),
    fullName: faker.name.fullName({ firstName, lastName }),
    avatarId,
  };
};

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries and local files
  await knex('users').del();
  await knex('localfile').del();
  rmSync(join(process.env.TRANSCENDENCE_APP_DATA as string, AVATARS_PATH), {
    recursive: true,
    force: true,
  });

  const avatars = await Promise.all(
    Array.from({ length: USERS_NUMBER }, createRandomAvatar),
  );
  const users = avatars.map((avatar) => createRandomUser(avatar.id));

  // Inserts seed entries
  await knex('localfile').insert(avatars);
  await knex('users').insert(users);
}
