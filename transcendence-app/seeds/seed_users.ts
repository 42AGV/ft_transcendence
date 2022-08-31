import { Knex } from 'knex';
import { faker } from '@faker-js/faker';

const USERS_NUMBER = 1000;

const createRandomUser = () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  return {
    username: faker.internet.userName(firstName, lastName).slice(0, 20),
    email: faker.internet.email(firstName, lastName),
    fullName: faker.name.fullName({ firstName, lastName }),
  };
};

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  // await knex('users').del();

  const users = Array.from({ length: USERS_NUMBER }, createRandomUser);

  // Inserts seed entries
  await knex('users').insert(users);
}
