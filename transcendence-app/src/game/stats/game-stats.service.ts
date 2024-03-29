import {
  GameResult,
  LevelCalculatorService,
} from './infrastructure/utils/level-calc.service';
import { IUserLevelRepository } from './infrastructure/db/user-level.repository';
import { Game } from '../infrastructure/db/game.entity';
import { UserLevel } from './infrastructure/db/user-level.entity';
import { Injectable } from '@nestjs/common';
import { UserLevelWithTimestampData } from './infrastructure/db/user-level-with-timestamp.entity';
import { GameMode } from '../enums/game-mode.enum';
import { GameStats } from './dto/game-stats.dto';

@Injectable()
export class GameStatsService {
  constructor(
    private readonly levelService: LevelCalculatorService,
    private readonly userLevelRepository: IUserLevelRepository,
  ) {}

  public async addLevelsWhenFinished(game: Game): Promise<void> {
    let playerOneFinalLevel;
    let playerTwoFinalLevel;
    const userOneLevel = await this.userLevelRepository.getLastLevel(
      game.playerOneUsername,
      game.gameMode,
    );
    const userTwoLevel = await this.userLevelRepository.getLastLevel(
      game.playerTwoUsername,
      game.gameMode,
    );
    if (game.playerOneScore > game.playerTwoScore) {
      playerOneFinalLevel = this.levelService.getNewLevel(
        userOneLevel,
        userTwoLevel,
        GameResult.WIN,
      );
      playerTwoFinalLevel = this.levelService.getNewLevel(
        userTwoLevel,
        userOneLevel,
        GameResult.LOSE,
      );
    } else if (game.playerOneScore < game.playerTwoScore) {
      playerOneFinalLevel = this.levelService.getNewLevel(
        userOneLevel,
        userTwoLevel,
        GameResult.LOSE,
      );
      playerTwoFinalLevel = this.levelService.getNewLevel(
        userTwoLevel,
        userOneLevel,
        GameResult.WIN,
      );
    } else {
      playerOneFinalLevel = this.levelService.getNewLevel(
        userOneLevel,
        userTwoLevel,
        GameResult.DRAW,
      );
      playerTwoFinalLevel = this.levelService.getNewLevel(
        userTwoLevel,
        userOneLevel,
        GameResult.DRAW,
      );
    }
    const newLevelOne = await this.userLevelRepository.addLevel(
      new UserLevel({
        username: game.playerOneUsername,
        gameId: game.id,
        level: playerOneFinalLevel,
      }),
    );
    const newLevelTwo = await this.userLevelRepository.addLevel(
      new UserLevel({
        username: game.playerTwoUsername,
        gameId: game.id,
        level: playerTwoFinalLevel,
      }),
    );
    if (!(newLevelOne && newLevelTwo)) {
      throw new Error('UserLevels could not be added');
    }
  }

  async getUserLevels(
    username: string,
    mode?: GameMode,
  ): Promise<UserLevelWithTimestampData[] | null> {
    return this.userLevelRepository.getUserLevels(username, mode);
  }

  async getGameStats(
    username: string,
    gameMode?: GameMode,
  ): Promise<GameStats> {
    const stats = await this.userLevelRepository.getGameResults(
      username,
      gameMode,
    );
    if (stats) return stats;
    return new GameStats({ wins: 0, draws: 0, losses: 0 });
  }
}
