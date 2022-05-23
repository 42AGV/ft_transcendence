import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  private readonly users: UserEntity[] = [];

  private findOne(username: string) {
    return this.users.find((user) => user.Dto.username === username) || null;
  }

  retrieveUserWithId(id: number) {
    return this.users.find((user) => user.id === id) || null;
  }

  private create(user: UserDto) {
    const userEntity = new UserEntity(user);
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
