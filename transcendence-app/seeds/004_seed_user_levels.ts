import { Knex } from 'knex';
import { UserLevel } from '../src/game/stats/infrastructure/db/user-level.entity';
import { GameData } from 'src/game/infrastructure/db/game.entity';

const LevelToElo = (level: number) => {
  return Math.max(Math.floor(50 * level + 950), 1000);
};

const EloToLevel = (elo: number) => {
  return Math.max((elo - 950) / 50, 1);
};

const K = 128;

enum EloStatus {
  LOSE = 0,
  WIN = 1,
}

const delta = (
  currentRating: number,
  opponentRating: number,
  status: EloStatus,
) => {
  const probabilityOfWin =
    1 / (1 + Math.pow(10, (opponentRating - currentRating) / 400));
  return Math.round(K * (status - probabilityOfWin));
};

const getNewEloRating = (
  currentRating: number,
  opponentRating: number,
  status: EloStatus,
) => {
  return currentRating + delta(currentRating, opponentRating, status);
};

const getLastLevel = async (knex: Knex, username: string) => {
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
      playerOneFinalLevel = EloToLevel(
        getNewEloRating(
          LevelToElo(userOneLevel),
          LevelToElo(userTwoLevel),
          EloStatus.WIN,
        ),
      );
      playerTwoFinalLevel = EloToLevel(
        getNewEloRating(
          LevelToElo(userTwoLevel),
          LevelToElo(userTwoLevel),
          EloStatus.LOSE,
        ),
      );
    } else {
      playerOneFinalLevel = EloToLevel(
        getNewEloRating(
          LevelToElo(userOneLevel),
          LevelToElo(userTwoLevel),
          EloStatus.LOSE,
        ),
      );
      playerTwoFinalLevel = EloToLevel(
        getNewEloRating(
          LevelToElo(userTwoLevel),
          LevelToElo(userTwoLevel),
          EloStatus.WIN,
        ),
      );
    }
    // console.log({
    //   one: {
    //     userOneLevel,
    //     playerOneFinalLevel,
    //     playerOneScore: game.playerOneScore,
    //     gameId: game.id,
    //   },
    //   two: {
    //     userTwoLevel,
    //     playerTwoFinalLevel,
    //     playerTwoScore: game.playerTwoScore,
    //     gameId: game.id,
    //   },
    // });
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
