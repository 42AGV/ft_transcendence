import { DataResponseWrapper } from 'src/shared/db/base.repository';
import { User } from '../../user.domain';

export interface IUserRepository {
  getByUsername(username: string): Promise<DataResponseWrapper<User>>;
  getByEmail(username: string): Promise<DataResponseWrapper<User>>;
  deleteByUsername(username: string): Promise<DataResponseWrapper<User>>;
  updateByUsername(
    username: string,
    user: Partial<User>,
  ): Promise<DataResponseWrapper<User>>;
  add(user: User): Promise<DataResponseWrapper<User>>;
}
