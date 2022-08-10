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
import { LocalFileDto } from '../shared/local-file/local-file.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: IUserRepository) {}

  retrieveUserWithId(id: string): Promise<User | null> {
    return this.userRepository.getById(id);
  }

  retrieveUsers({
    limit = MAX_USER_ENTRIES_PER_PAGE,
    offset = 0,
    sort = BooleanString.False,
    search = '',
  }: UsersPaginationQueryDto): Promise<User[] | null> {
    return this.userRepository.getPaginatedUsers({
      limit,
      offset,
      sort,
      search,
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

  addAvatarAndUser(fileDto: LocalFileDto, userDto: UserDto) {
    return this.userRepository.addAvatarAndAddUser(
      { id: uuidv4(), createdAt: new Date(Date.now()), ...fileDto },
      { id: uuidv4(), createdAt: new Date(Date.now()), ...userDto },
    );
  }

  updateUser(userId: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.updateById(userId, updateUserDto);
  }
}
