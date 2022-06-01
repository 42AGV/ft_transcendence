import {
  Controller,
  Delete,
  Get,
  Request as GetRequest,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { OAuth42Guard } from './oauth42.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Get('login')
  @ApiOkResponse({ description: 'Login successfully' })
  @ApiFoundResponse({ description: 'Redirect to 42 OAuth server' })
  @ApiBadGatewayResponse({ description: 'Bad Gateway' })
  @UseGuards(OAuth42Guard)
  oauth42Login() {
    // Guard implementation
  }

  @Delete('logout')
  @ApiOkResponse({ description: 'Logout successfully' })
  logout(@GetRequest() req: Request) {
    req.logout();
  }
}
