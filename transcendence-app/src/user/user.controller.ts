import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post(':id')
  async addUser(@Param('id') param: string) {
    const id = Number(param);
    this.userService.findOneOrCreate({
      id: id,
      provider: 'ft_transcendence',
      image_url: 'www.img_url.com',
      username: `user_${id}`,
      email: 'afgv@github.com',
    });
  }

  @Get(':id')
  async getUserById(@Param('id') param: string): Promise<UserDto | undefined> {
    const result: UserDto | undefined = this.userService.retrieveUserWithId(
      Number(param),
    );
    if (result === undefined)
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return result;
  }
}
