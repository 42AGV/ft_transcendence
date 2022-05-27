import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  private readonly users: UserEntity[] = [];

  private findOne(username: string) {
    return this.users.find((user) => user.username === username) || null;
  }

  retrieveUserWithId(id: string) {
    return this.users.find((user) => user.id === id) || null;
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
