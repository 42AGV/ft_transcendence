import { Knex } from 'knex';
import { defaultUsernames } from './utils';
import { Game } from '../src/game/infrastructure/db/game.entity';

const GAMES_NUMBER = 100;

let startTime = Date.now();

const createRandomGame = (userName1: string, userName2: string) => {
  let losingScore = Math.floor(Math.random() * 10);
  const key: keyof Game =
    losingScore % 2 === 0 ? 'playerOneScore' : 'playerTwoScore';
  const otherKey: keyof Game =
    key === 'playerTwoScore' ? 'playerOneScore' : 'playerTwoScore';
  const oldDate = startTime;
  startTime = startTime + 120 * 1000;
  return {
    createdAt: new Date(oldDate),
    playerOneUsername: userName1,
    playerTwoUsername: userName2,
    gameDurationInSeconds: Math.abs(Math.floor(Math.random() * 100)) + 10,
    [key]: 10,
    [otherKey]: losingScore,
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
  const games = Array.from({ length: GAMES_NUMBER }, () => {
    const usernameOne = getRandomUser().username;
    let usernameTwo = getRandomUser().username;
    while (usernameTwo === usernameOne) {
      usernameTwo = getRandomUser().username;
    }
    return createRandomGame(usernameOne, usernameTwo);
  });
  // Insert games seed entries
  await knex('game').insert(games);
};

export async function seed(knex: Knex): Promise<void> {
  await seedGames(knex);
}
