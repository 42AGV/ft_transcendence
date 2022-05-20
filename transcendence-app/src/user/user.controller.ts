import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('new?')
  async addUser(
    @Query()
    query: {
      provider: string;
      username: string;
      email: string;
      image_url: string;
    },
  ): Promise<UserEntity> {
    return this.userService.findOneOrCreate({
      provider: query.provider,
      username: query.username,
      email: query.email,
      image_url: query.image_url,
    });
  }

  @Get(':id')
  async getUserById(@Param('id') param: string): Promise<UserEntity> {
    const result = this.userService.retrieveUserWithId(Number(param));
    if (result === undefined) throw new NotFoundException();
    return result;
  }
}
