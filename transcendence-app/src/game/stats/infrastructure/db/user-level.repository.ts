import { UserLevel } from './user-level.entity';
import { PaginationQueryDto } from '../../../../shared/dtos/pagination.query.dto';
import { UserLevelWithTimestampData } from './user-level-with-timestamp.entity';

export abstract class IUserLevelRepository {
  abstract addLevel(userLevel: UserLevel): Promise<UserLevel | null>;
  abstract getPaginatedLevels(
    username: string,
    paginationDto: Required<PaginationQueryDto>,
  ): Promise<UserLevelWithTimestampData[] | null>;
}
