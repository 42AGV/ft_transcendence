import { Knex } from 'knex';
import { UserLevel } from '../src/game/stats/infrastructure/db/user-level.entity';
import { GameData } from 'src/game/infrastructure/db/game.entity';

export enum GameResult {
  LOSE = 0,
  WIN = 1,
}

class LevelService {
  private readonly MINIMUM_LEVEL = 1;
  private readonly MINIMUM_ELO = 1000;
  private readonly ELO_STEPS_PER_LEVEL = 50;
  private readonly HYPOTHETICAL_ELO_AT_ZERO_LEVEL =
    this.MINIMUM_ELO - this.ELO_STEPS_PER_LEVEL;
  private readonly K = 128; // normal is 32, but we want quicker change

  private levelToElo = (level: number) => {
    return Math.max(
      Math.floor(
        this.ELO_STEPS_PER_LEVEL * level + this.HYPOTHETICAL_ELO_AT_ZERO_LEVEL,
      ),
      this.MINIMUM_ELO,
    );
  };

  private eloToLevel = (elo: number) => {
    return Math.max(
      (elo - this.HYPOTHETICAL_ELO_AT_ZERO_LEVEL) / this.ELO_STEPS_PER_LEVEL,
      this.MINIMUM_LEVEL,
    );
  };

  private delta = (
    currentRating: number,
    opponentRating: number,
    status: GameResult,
  ) => {
    const probabilityOfWin =
      1 / (1 + Math.pow(10, (opponentRating - currentRating) / 400));
    return Math.round(this.K * (status - probabilityOfWin));
  };

  private getNewEloRating = (
    currentRating: number,
    opponentRating: number,
    status: GameResult,
  ) => {
    return currentRating + this.delta(currentRating, opponentRating, status);
  };

  public getNewLevel = (
    currentLevel: number,
    opponentLevel: number,
    status: GameResult,
  ) => {
    return this.eloToLevel(
      this.getNewEloRating(
        this.levelToElo(currentLevel),
        this.levelToElo(opponentLevel),
        status,
      ),
    );
  };
}

const getLastLevel = async (knex: Knex, username: string) => {
  const userLevel = await knex
    .with(
      'ults',
      knex
        .select(
          'userlevel.gameId',
          'userlevel.username',
          'userlevel.level',
          'game.createdAt',
          'game.gameDurationInSeconds',
        )
        .from('userlevel')
        .innerJoin('game', 'userlevel.gameId', '=', 'game.id')
        .where('userlevel.username', username)
        .orderBy([{ column: 'createdAt', order: 'desc' }]),
    )
    .select(
      knex.raw(
        'ults."createdAt" + interval \'1 second\' * ults."gameDurationInSeconds" as timestamp' +
          ', ults.username, ults."gameId", ults.level',
      ),
    )
    .from('ults')
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
  const levelService = new LevelService();
  for (const game of games) {
    const userOneLevel = await getLastLevel(knex, game.playerOneUsername);
    const userTwoLevel = await getLastLevel(knex, game.playerTwoUsername);
    let playerOneFinalLevel;
    let playerTwoFinalLevel;
    if (game.playerOneScore > game.playerTwoScore) {
      playerOneFinalLevel = levelService.getNewLevel(
        userOneLevel,
        userTwoLevel,
        GameResult.WIN,
      );
      playerTwoFinalLevel = levelService.getNewLevel(
        userTwoLevel,
        userOneLevel,
        GameResult.LOSE,
      );
    } else {
      playerOneFinalLevel = levelService.getNewLevel(
        userOneLevel,
        userTwoLevel,
        GameResult.LOSE,
      );
      playerTwoFinalLevel = levelService.getNewLevel(
        userTwoLevel,
        userOneLevel,
        GameResult.WIN,
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
      level: playerOneFinalLevel,
    });
    const userTwo = new UserLevel({
      username: game.playerTwoUsername,
      gameId: game.id,
      level: playerTwoFinalLevel,
    });
    await knex('userlevel').insert([userOne, userTwo]);
  }
};

export async function seed(knex: Knex): Promise<void> {
  await seedUserLevels(knex);
}
