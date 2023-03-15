import { PaginationWithSearchQueryDto } from '../../../shared/dtos/pagination-with-search.query.dto';
import { Friend } from './friend.entity';
import { User } from './user.entity';
import { UserWithLevelDto } from '../../../shared/dtos/user-with-level.dto';

export abstract class IFriendRepository {
  abstract addFriend(friend: Friend): Promise<Friend | null>;
  abstract getFriend(
    followerId: string,
    followedId: string,
  ): Promise<Friend | null>;
  abstract deleteFriend(
    followerId: string,
    followedId: string,
  ): Promise<Friend | null>;
  abstract getFriends(followerId: string): Promise<User[] | null>;
  abstract getPaginatedFriends(
    followerId: string,
    paginationDto: Required<PaginationWithSearchQueryDto>,
  ): Promise<UserWithLevelDto[] | null>;
}
