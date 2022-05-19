import { Controller, Get, Session, UseGuards } from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../user/decorators/user.decorator';
import { UserDto } from '../user/dto/user.dto';
import { OAuth42Guard } from './oauth42.guard';

@ApiTags('oauth42')
@Controller('oauth42')
export class OAuth42Controller {
  @Get()
  @ApiFoundResponse()
  @ApiBadGatewayResponse()
  @UseGuards(OAuth42Guard)
  async oauth42Login(
    @User() user: UserDto,
    @Session() session: Record<string, any>,
  ) {
    session.authenticated = true;
    return user;
  }
}
