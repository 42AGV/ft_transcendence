import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Request as GetRequest,
  UseGuards,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthenticatedGuard } from '../shared/guards/authenticated.guard';
import { OAuth42Guard } from './oauth42.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Get('login')
  @ApiOkResponse({ description: 'Login successfully' })
  @ApiFoundResponse({ description: 'Redirect to 42 OAuth server' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  @UseGuards(OAuth42Guard)
  oauth42Login() {
    // Guard implementation
  }

  @Delete('logout')
  @UseGuards(AuthenticatedGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOkResponse({ description: 'Logout successfully' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  logout(@GetRequest() req: Request) {
    req.logout((err: Error) => {
      if (err) {
        throw new NotFoundException(err.message);
      }
    });
  }
}
