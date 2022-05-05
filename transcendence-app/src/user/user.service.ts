import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private readonly users: UserDto[] = [];

  private findOne(username: string) {
    const user = this.users.find((user) => user.username === username);
    return user;
  }

  private create(userDto: UserDto) {
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
