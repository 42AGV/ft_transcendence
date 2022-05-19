import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './user.entity';
import { Constants } from '../shared/enums/commonconsts.enum';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  private static Id: number = Constants.UserIdStart;

  @Post()
  async addUser(): Promise<UserEntity> {
    const user: UserDto = {
      provider: 'ft_transcendence',
      image_url: 'www.img_url.com/hello.jpg',
      username: `user_${UserController.Id++}`,
      email: 'afgv@github.com',
    };
    return this.userService.findOneOrCreate(user);
  }

  @Get(':id')
  async getUserById(@Param('id') param: string): Promise<UserEntity> {
    const result = this.userService.retrieveUserWithId(Number(param));
    if (result === undefined) throw new NotFoundException();
    return result;
  }
}
