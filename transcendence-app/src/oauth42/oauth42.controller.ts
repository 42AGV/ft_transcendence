import { Controller, Get, UseGuards } from '@nestjs/common';
import { User as GetUser } from '../user/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { OAuth42Guard } from './oauth42.guard';

@Controller('oauth42')
export class OAuth42Controller {
  @Get()
  @UseGuards(OAuth42Guard)
  async oauth42Login(@GetUser() user: User) {
    return user;
  }
}
