import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './user.entity';
import { v4 as uuidv4 } from 'uuid';
import { UsersPaginationQueryDto } from './dto/user.pagination.dto';

const MAX_USER_ENTRIES_PER_PAGE = 20;

@Injectable()
export class UserService {
  private readonly users: UserEntity[] = [];

  private findOne(username: string) {
    return this.users.find((user) => user.username === username) || null;
  }

  retrieveUserWithId(id: string) {
    return this.users.find((user) => user.id === id) || null;
  }
  retrieveUsers(queryDto: UsersPaginationQueryDto) {
    const limit = queryDto.limit ?? MAX_USER_ENTRIES_PER_PAGE;
    const offset = queryDto.offset ?? 0;
    const usersCopy = [...this.users];

    if (queryDto.sort) {
      usersCopy.sort((a, b) =>
        a.username > b.username ? 1 : a.username === b.username ? 0 : -1,
      );
    }

    return usersCopy.slice(offset, offset + limit);
  }

  private create(user: UserDto) {
    let userEntity: UserEntity = {
      id: uuidv4(),
      createdAt: new Date(Date.now()),
      ...user,
    };

    for (let index = 0; index < 50; index++) {
      userEntity = {
        id: uuidv4(),
        createdAt: new Date(Date.now()),
        username: user.username + index,
        avatar: user.avatar,
        email: user.email,
      };
      this.users.push(userEntity);
    }
    return userEntity;
  }

  findOneOrCreate(user: UserDto) {
    let found = this.findOne(user.username);
    if (!found) {
      found = this.create(user);
    }
    return found;
  }
}
