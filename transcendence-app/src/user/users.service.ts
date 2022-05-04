import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

// This should be a real class/interface representing a user entity
export type UserEntity = {
  provider: string;
  externalProviderId: number;
  username: string;
  email: string;
  image_url: string;
};

@Injectable()
export class UsersService {
  private readonly users = [];

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
