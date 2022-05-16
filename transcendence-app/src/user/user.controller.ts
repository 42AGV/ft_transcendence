import { Controller, Get, Post} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
  ) {}

  @Post('users/:id')
  async addUser(id: number) {
    this.userService.findOneOrCreate({
      id: id,
      provider: 'ft_transcendence',
      image_url: "www.img_url.com",
      username: `user_${id}`,
      email: "agv@github.com",
    });
  }

  @Get('users/:id')
  async getUserById(id: number) {
    return this.userService.retrieveUserWithId(id);
  }
}
