import {
  Controller,
  Get,
  Request as GetRequest,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { OAuth42Guard } from './oauth42.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Get('oauth42')
  @ApiFoundResponse()
  @ApiBadGatewayResponse()
  @UseGuards(OAuth42Guard)
  async oauth42Login() {
    return 'Login successfully';
  }

  @Get('logout')
  logout(@GetRequest() req: Request) {
    req.logout();
    return 'Logout successfully';
  }
}
