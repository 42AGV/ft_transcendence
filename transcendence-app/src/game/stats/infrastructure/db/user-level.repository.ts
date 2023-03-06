import { UserLevel } from './user-level.entity';
import { UserLevelWithTimestampData } from './user-level-with-timestamp.entity';
import { GameMode } from '../../../enums/game-mode.enum';
import { GameStats } from '../../dto/game-stats.dto';

export abstract class IUserLevelRepository {
  abstract addLevel(userLevel: UserLevel): Promise<UserLevel | null>;
  abstract getUserLevels(
    username: string,
    gameMode?: GameMode,
  ): Promise<UserLevelWithTimestampData[] | null>;
  abstract getLastLevel(username: string, gameMode: GameMode): Promise<number>;
  abstract getGameResults(
    username: string,
    gameMode?: GameMode,
  ): Promise<GameStats | null>;
}
