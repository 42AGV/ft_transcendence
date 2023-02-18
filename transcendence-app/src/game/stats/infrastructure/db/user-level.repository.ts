import { UserLevel } from './user-level.entity';
import { PaginationQueryDto } from '../../../../shared/dtos/pagination.query.dto';

export abstract class IUserLevelRepository {
  abstract addLevel(userLevel: UserLevel): Promise<UserLevel | null>;
  abstract getPaginatedLevels(
    username: string,
    paginationDto: Required<PaginationQueryDto>,
  ): Promise<UserLevel[] | null>;
}
