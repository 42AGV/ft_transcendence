import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Req,
  Request as GetRequest,
  Res,
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
import { Request, Response } from 'express';
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
  oauth42Login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { state } = req.query;
    if (typeof state === 'string') {
      res.redirect(state);
    }
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
