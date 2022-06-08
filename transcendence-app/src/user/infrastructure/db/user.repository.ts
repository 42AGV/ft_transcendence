import { DataResponseWrapper } from 'src/shared/db/base.repository';
import { User } from '../../user.domain';

export abstract class IUserRepository {
  abstract getById(id: string): Promise<DataResponseWrapper<User>>;
  abstract getByUsername(username: string): Promise<DataResponseWrapper<User>>;
  abstract getByEmail(username: string): Promise<DataResponseWrapper<User>>;
  abstract deleteByUsername(
    username: string,
  ): Promise<DataResponseWrapper<User>>;
  abstract updateByUsername(
    username: string,
    user: Partial<User>,
  ): Promise<DataResponseWrapper<User>>;
  abstract add(user: User): Promise<DataResponseWrapper<User>>;
}
