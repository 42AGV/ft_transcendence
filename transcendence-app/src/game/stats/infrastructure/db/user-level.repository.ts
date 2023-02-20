import { UserLevel } from './user-level.entity';
import { PaginationQueryDto } from '../../../../shared/dtos/pagination.query.dto';
import { UserLevelWithTimestampData } from './user-level-with-timestamp.entity';
import { GameMode } from '../../../enums/game-mode.enum';

export abstract class IUserLevelRepository {
  abstract addLevel(userLevel: UserLevel): Promise<UserLevel | null>;
  abstract getPaginatedLevels(
    username: string,
    gameMode: GameMode,
    paginationDto: Required<PaginationQueryDto>,
  ): Promise<UserLevelWithTimestampData[] | null>;
  abstract getLastLevel(username: string, gameMode: GameMode): Promise<number>;
}
