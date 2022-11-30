import { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import { rmSync } from 'fs';
import { Password } from '../src/shared/password';
import { configService, createRandomAvatar, defaultUsernames } from './utils';
import { join } from 'path';
import { AVATARS_PATH } from '../src/shared/constants';

const USERS_NUMBER = 5000;

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

const createUserWithPassword = async (username: string, avatarId: string) => {
  const hashedPassword = await Password.toHash(username);
  return {
    username,
    email: `${username}@${username}.com`,
    fullName: username,
    avatarId: avatarId,
    password: hashedPassword,
  };
};

const createAdminWithPassword = async (avatarId: string) => {
	const hashedPassword = await Password.toHash(configService.get('WEBSITE_OWNER_PASSWORD') as string);
	return {
	  username: 'admin',
	  email: `admin@transcendence.live`,
	  fullName: 'admin',
	  avatarId: avatarId,
	  password: hashedPassword,
	};
  };

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries and local files
  await knex('users').del();
  const appDataPath = configService.get('TRANSCENDENCE_APP_DATA') as string;
  const avatarsPath = join(appDataPath, AVATARS_PATH);
  rmSync(avatarsPath, {
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

  // Create users with default password
  const defaultAvatars = await Promise.all(
    Array.from({ length: defaultUsernames.length }, createRandomAvatar),
  );
  const usersWithPassword = await Promise.all(
    defaultUsernames.map((username, index) =>
      createUserWithPassword(username, defaultAvatars[index].id),
    ),
  );


  const adminAvatar: {
    filename: string;
    path: string;
    mimetype: string;
    size: number;
    id: string;
} = await createRandomAvatar();

  const adminWithPassword = await createAdminWithPassword(adminAvatar.id);

  // Inserts admin entry
  await knex('localfile').insert(adminAvatar);
  await knex('users').insert(adminWithPassword);

  // Inserts seed entries
  await knex('localfile').insert(defaultAvatars);
  await knex('users').insert(usersWithPassword);
}
