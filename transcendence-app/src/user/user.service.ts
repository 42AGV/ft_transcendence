import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './user.entity';
import { v4 as uuidv4 } from 'uuid';
import {
  MAX_USER_ENTRIES_PER_PAGE,
  UsersPaginationQueryDto,
} from './dto/user.pagination.dto';

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
    if (queryDto.limit || queryDto.offset) {
      let ret: string[] = [];
      queryDto.limit = queryDto.limit
        ? queryDto.limit
        : MAX_USER_ENTRIES_PER_PAGE;
      queryDto.offset = queryDto.offset ? queryDto.offset : 0;
      ret = this.users
        .filter((user, i) => i >= queryDto.offset && i < queryDto.limit)
        .map((user) => user.username);
      return queryDto.sort ? ret.sort() : ret;
    }
    return this.users;
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

  findOneOrCreate(user: UserDto) {
    let found = this.findOne(user.username);
    if (!found) {
      found = this.create(user);
    }
    return found;
  }
}
