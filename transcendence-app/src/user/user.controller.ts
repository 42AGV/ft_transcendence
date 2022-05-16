import {Controller, Get, Param, Post} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
  ) {}

  @Post(':id')
  async addUser(@Param('id') param: string) {
    const id : number = Number(param);
    this.userService.findOneOrCreate({
      id: id,
      provider: 'ft_transcendence',
      image_url: "www.img_url.com",
      username: `user_${id}`,
      email: "agpv@github.com",
    });
  }

  @Get(':id')
  async getUserById(@Param('id') param: string) {
    return this.userService.retrieveUserWithId(Number(param));
  }
}
