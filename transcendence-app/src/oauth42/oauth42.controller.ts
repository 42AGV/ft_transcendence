import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserEntity } from '../users/users.service';
import { User } from '../users/decorators/user.decorator';
import { OAuth42Guard } from './oauth42.guard';

@Controller('oauth42')
export class OAuth42Controller {
  @Get()
  @UseGuards(OAuth42Guard)
  async getUserFromIntraLogin(@User() user: UserEntity) {
    return user;
  }
}
