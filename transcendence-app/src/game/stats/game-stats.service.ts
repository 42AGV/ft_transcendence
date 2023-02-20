import { LevelCalculatorService } from './infrastructure/utils/level-calc.service';
import { IUserLevelRepository } from './infrastructure/db/user-level.repository';
import { Game } from '../infrastructure/db/game.entity';
import { GameResult } from '../../../seeds/004_seed_user_levels';
import { UserLevel } from './infrastructure/db/user-level.entity';
import { Injectable } from '@nestjs/common';

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
    );
    const userTwoLevel = await this.userLevelRepository.getLastLevel(
      game.playerTwoUsername,
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
    } else {
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
}
