import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post(':id')
  async addUser(@Param('id') param: string): Promise<UserDto> {
    const id = Number(param);
    const user: UserDto = {
      id: id,
      provider: 'ft_transcendence',
      image_url: 'www.img_url.com/hello.jpg',
      username: `user_${id}`,
      email: 'afgv@github.com',
    };
    this.userService.findOneOrCreate(user);
    return user;
  }

  @Get(':id')
  async getUserById(@Param('id') param: string): Promise<UserDto> {
    const result = this.userService.retrieveUserWithId(Number(param));
    if (result === undefined) throw new NotFoundException();
    return result;
  }
}
