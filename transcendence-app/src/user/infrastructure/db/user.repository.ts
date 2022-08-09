import { LocalFile } from '../../../shared/local-file/local-file.domain';
import { UsersPaginationQueryDto } from '../../dto/user.pagination.dto';
import { User } from '../../user.domain';

export abstract class IUserRepository {
  abstract getById(id: string): Promise<User | null>;
  abstract getByUsername(username: string): Promise<User | null>;
  abstract getByEmail(username: string): Promise<User | null>;
  abstract deleteByUsername(username: string): Promise<User | null>;
  abstract updateByUsername(
    username: string,
    user: Partial<User>,
  ): Promise<User | null>;
  abstract add(user: User): Promise<User | null>;
  abstract getPaginatedUsers(
    queryDto: Required<UsersPaginationQueryDto>,
  ): Promise<User[] | null>;
  abstract addAvatarAndAddUser(
    avatar: LocalFile,
    user: User,
  ): Promise<User | null>;
}
