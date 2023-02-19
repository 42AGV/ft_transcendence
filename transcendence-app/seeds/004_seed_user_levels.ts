import { Knex } from 'knex';
import {
  UserLevel,
  UserLevelData,
} from '../src/game/stats/infrastructure/db/user-level.entity';
import { GameData } from 'src/game/infrastructure/db/game.entity';

const getLastLevel = async (knex: Knex, username: string) => {
  console.log(username);
  const userLevel = await knex
    .select('*')
    .from('userlevel')
    .where('username', username)
    .orderBy([{ column: 'timestamp', order: 'desc' }]);
  if (userLevel.length === 0) {
    return 1;
  }
  return userLevel[0].level;
};

const seedUserLevels = async (knex: Knex) => {
  await knex('userlevel').del();
  const games: GameData[] = await knex
    .select('*')
    .from('game')
    .orderBy([{ column: 'createdAt', order: 'desc' }]);
  for (const game of games) {
    const userOneLevel = await getLastLevel(knex, game.playerOneUsername);
    const userTwoLevel = await getLastLevel(knex, game.playerTwoUsername);
    let playerOneFinalLevel;
    let playerTwoFinalLevel;
    if (game.playerOneScore > game.playerTwoScore) {
      playerOneFinalLevel = userOneLevel + 0.2;
      playerTwoFinalLevel = Math.max(userTwoLevel - 0.2, 1);
    } else {
      playerOneFinalLevel = Math.max(userOneLevel - 0.2, 1);
      playerTwoFinalLevel = userTwoLevel + 0.2;
    }
    const userOne = new UserLevel({
      username: game.playerOneUsername,
      gameId: game.id,
      timestamp: new Date(
        game.createdAt.getTime() + game.gameDurationInSeconds * 1000,
      ),
      level: playerOneFinalLevel,
    });
    const userTwo = new UserLevel({
      username: game.playerTwoUsername,
      gameId: game.id,
      timestamp: new Date(
        game.createdAt.getTime() + game.gameDurationInSeconds * 1000,
      ),
      level: playerTwoFinalLevel,
    });
    await knex('userlevel').insert([userOne, userTwo]);
  }
};

export async function seed(knex: Knex): Promise<void> {
  await seedUserLevels(knex);
}
