import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserEntity } from '../../users/users.service';
import { User } from '../../users/decorators/user.decorator';
import { FortyTwoAuthGuard } from './fortytwo.guard';

@Controller('auth/42')
export class FortyTwoController {
  @Get()
  @UseGuards(FortyTwoAuthGuard)
  async getUserFromIntraLogin(@User() user: UserEntity) {
    return user;
  }
}
