import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly users: User[] = [];

  private findOne(username: string) {
    const user = this.users.find((user) => user.username === username);
    return user;
  }

  private create(userDto: CreateUserDto) {
    this.users.push(userDto);
    return userDto;
  }

  findOneOrCreate(userDto: CreateUserDto) {
    let user = this.findOne(userDto.username);

    if (!user) {
      user = this.create(userDto);
    }

    return user;
  }
}
