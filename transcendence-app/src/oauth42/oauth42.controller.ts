import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBadGatewayResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../user/decorators/user.decorator';
import { UserDto } from '../user/dto/user.dto';
import { OAuth42Guard } from './oauth42.guard';

@ApiTags('oauth42')
@Controller('oauth42')
export class OAuth42Controller {
  @Get()
  @ApiResponse({ status: HttpStatus.FOUND })
  @ApiBadGatewayResponse()
  @UseGuards(OAuth42Guard)
  async oauth42Login(@User() user: UserDto) {
    return user;
  }
}
