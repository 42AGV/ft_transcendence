import { BadRequestException, Injectable } from '@nestjs/common';
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
  retrieveUsers() {
    return this.users;
  }
  retrieveUsernames(take: number, skip: number, sort: boolean): string[] {
    const ret: string[] = [];
    if (take < 0 || skip < 0 || skip >= this.users.length)
      throw new BadRequestException('Provided values incorrect');
    take = skip + take > this.users.length ? this.users.length : skip + take;
    for (let i = skip; i < take; i++) {
      ret.push(this.users[i].username);
    }
    if (sort) return ret.sort();
    return ret;
  }

  private create(user: UserDto) {
    const userEntity: UserEntity = { id: uuidv4(), ...user };
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
