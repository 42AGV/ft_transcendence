import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private static lastUserId = 1;
  private readonly users: UserDto[] = [];

  private findOne(username: string) {
    const user = this.users.find((user) => user.username === username);
    return user;
  }

  retrieveUserWithId(id: number) {
    return this.users.find((user) => user.id === id);
  }

  private create(userDto: UserDto) {
    if (userDto.id === undefined) {
      userDto.id = UserService.lastUserId++;
    }
    this.users.push(userDto);
    return userDto;
  }

  findOneOrCreate(userDto: UserDto) {
    let user = this.findOne(userDto.username);

    if (!user) {
      user = this.create(userDto);
    }

    return user;
  }
}
