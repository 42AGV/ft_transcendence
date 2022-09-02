import { Knex } from 'knex';
import { faker } from '@faker-js/faker';

const USERS_NUMBER = 5000;

const createRandomUser = () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const username = faker.helpers.unique(faker.internet.userName, [
    firstName,
    lastName,
  ]);
  const email = faker.helpers.unique(faker.internet.email, [
    firstName,
    lastName,
  ]);
  return {
    username: username.slice(-20),
    email: email.slice(-50),
    fullName: faker.name.fullName({ firstName, lastName }),
  };
};

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del().whereNot('username', 'like', '%admin%');

  const users = Array.from({ length: USERS_NUMBER }, createRandomUser);

  // Inserts seed entries
  await knex('users').insert(users);
}
