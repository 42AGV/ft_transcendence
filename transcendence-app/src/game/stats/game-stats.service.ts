import {
  GameResult,
  LevelCalculatorService,
} from './infrastructure/utils/level-calc.service';
import { IUserLevelRepository } from './infrastructure/db/user-level.repository';
import { Game } from '../infrastructure/db/game.entity';
import { UserLevel } from './infrastructure/db/user-level.entity';
import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../../shared/dtos/pagination.query.dto';
import { UserLevelWithTimestampData } from './infrastructure/db/user-level-with-timestamp.entity';
import { MAX_ENTRIES_PER_PAGE } from '../../shared/constants';
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

  async getPaginatedLevels(
    username: string,
    mode: GameMode = GameMode.classic,
    { limit = MAX_ENTRIES_PER_PAGE, offset = 0 }: PaginationQueryDto,
  ): Promise<UserLevelWithTimestampData[] | null> {
    return this.userLevelRepository.getPaginatedLevels(username, mode, {
      limit,
      offset,
    });
  }

  async GameStats(username: string, gameMode?: GameMode): Promise<GameStats> {
    return new GameStats({
      winRatio: await this.userLevelRepository.getWinGameRatio(
        username,
        gameMode,
      ),
    });
  }
}
