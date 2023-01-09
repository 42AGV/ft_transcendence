import { AuthProviderType } from '../../../auth/auth-provider/auth-provider.service';
import { PaginationWithSearchQueryDto } from '../../../shared/dtos/pagination-with-search.query.dto';
import { LocalFile } from '../../../shared/local-file/infrastructure/db/local-file.entity';
import { User } from './user.entity';

export abstract class IUserRepository {
  abstract getById(id: string): Promise<User | null>;
  abstract getByUsername(username: string): Promise<User | null>;
  abstract getByEmail(username: string): Promise<User | null>;
  abstract deleteByUsername(username: string): Promise<User | null>;
  abstract updateById(
    id: string,
    updateUser: Partial<User>,
  ): Promise<User | null>;
  abstract add(user: User): Promise<User | null>;
  abstract getPaginatedUsers(
    queryDto: Required<PaginationWithSearchQueryDto>,
  ): Promise<User[] | null>;
  abstract addAvatarAndAddUser(
    avatar: LocalFile,
    user: User,
  ): Promise<User | null>;
  abstract addAvatarAndUpdateUser(
    avatar: LocalFile,
    user: User,
  ): Promise<User | null>;
  abstract getByAuthProvider(
    provider: AuthProviderType,
    providerId: string,
  ): Promise<User | null>;
}
