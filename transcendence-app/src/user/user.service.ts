import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { v4 as uuidv4 } from 'uuid';
import {
  MAX_USER_ENTRIES_PER_PAGE,
  UsersPaginationQueryDto,
} from './dto/user.pagination.dto';
import { BooleanString } from '../shared/enums/boolean-string.enum';
import { IUserRepository } from './infrastructure/db/user.repository';
import { User } from './user.domain';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: IUserRepository) {}

  retrieveUserWithId(id: string): Promise<User | null> {
    return this.userRepository.getById(id);
  }

  retrieveUsers(queryDto: UsersPaginationQueryDto): Promise<User[] | null> {
    const limit = queryDto.limit ?? MAX_USER_ENTRIES_PER_PAGE;
    const offset = queryDto.offset ?? 0;
    const sort = queryDto.sort ?? BooleanString.False;

    return this.userRepository.getPaginatedUsers({
      limit,
      offset,
      sort,
    });
  }

  retrieveUserWithUserName(username: string): Promise<User | null> {
    return this.userRepository.getByUsername(username);
  }

  addUser(user: UserDto): Promise<User | null> {
    return this.userRepository.add({
      id: uuidv4(),
      createdAt: new Date(Date.now()),
      ...user,
    });
  }

  updateUser(userId: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.updateById(userId, updateUserDto);
  }
}
