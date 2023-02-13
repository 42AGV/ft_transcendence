import { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import { defaultUsernames } from './utils';

const GAMES_NUMBER = 30;

const createRandomGame = (userName1: string, userName2: string) => {
  if (userName1 === userName2) return;
  else
    return {
      playerOneUsername: userName1,
      playerTwoUsername: userName2,
      gameDurationInSeconds: faker.random.numeric(),
      playerOneScore: faker.random.numeric(),
      playerTwoScore: faker.random.numeric(),
      gameMode: 'classic',
    };
};
const seedGames = async (knex: Knex) => {
  await knex('game').del();
  // Create games seed entries
  const users = await knex
    .select('*')
    .from('users')
    .whereIn('username', defaultUsernames);
  const getRandomUser = () => users[Math.floor(Math.random() * users.length)];
  const games = Array.from({ length: GAMES_NUMBER }, () =>
    createRandomGame(getRandomUser().username, getRandomUser().username),
  );
  // Insert games seed entries
  await knex('game').insert(games);
};

export async function seed(knex: Knex): Promise<void> {
  await seedGames(knex);
}
