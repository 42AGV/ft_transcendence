import { Injectable, Logger } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './user.entity';
import { v4 as uuidv4 } from 'uuid';
import {
  MAX_USER_ENTRIES_PER_PAGE,
  UsersPaginationQueryDto,
} from './dto/user.pagination.dto';
import { BooleanString } from '../shared/enums/boolean-string.enum';
import { IUserRepository } from './infrastructure/db/user.repository';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(private repository: IUserRepository) {}

  retrieveUserWithId(id: string) {
    return this.users.find((user) => user.id === id) || null;
  }

  retrieveUsers(queryDto: UsersPaginationQueryDto) {
    const limit = queryDto.limit ?? MAX_USER_ENTRIES_PER_PAGE;
    const offset = queryDto.offset ?? 0;
    const usersCopy = [...this.users];

    if (queryDto.sort === BooleanString.True) {
      usersCopy.sort((a, b) =>
        a.username > b.username ? 1 : a.username === b.username ? 0 : -1,
      );
    }

    return usersCopy.slice(offset, offset + limit);
  }

  findOneOrCreate(user: UserDto) {
    let found = this.findOne(user.username);
    if (!found) {
      found = this.create(user);
    }
    return found;
  }

  async retrieveUserWithUserName(username: string) {
    try {
      const data = await this.repository.getByUsername(username);
      return data;
    } catch (e) {
      // TODO logging task
      this.logger.warn(e);
    }
  }

  private readonly users: UserEntity[] = [];

  private findOne(username: string) {
    return this.users.find((user) => user.username === username) || null;
  }

  private create(user: UserDto) {
    const userEntity: UserEntity = {
      id: uuidv4(),
      createdAt: new Date(Date.now()),
      ...user,
    };
    this.users.push(userEntity);
    return userEntity;
  }
}
