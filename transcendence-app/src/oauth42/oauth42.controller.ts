import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserEntity } from '../user/user.service';
import { User } from '../user/decorators/user.decorator';
import { OAuth42Guard } from './oauth42.guard';

@Controller('oauth42')
export class OAuth42Controller {
  @Get()
  @UseGuards(OAuth42Guard)
  async getUserFromIntraLogin(@User() user: UserEntity) {
    return user;
  }
}
