import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Redirect,
  Req,
  Request as GetRequest,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { SocketService } from '../socket/socket.service';
import { AuthenticatedGuard } from '../shared/guards/authenticated.guard';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './local.guard';
import { OAuth42Guard } from './oauth42.guard';
import { User } from '../user/infrastructure/db/user.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly socketService: SocketService,
  ) {}

  @Get('login')
  @ApiOkResponse({ description: 'Login successfully' })
  @ApiFoundResponse({ description: 'Redirect to 42 OAuth server' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  @UseGuards(OAuth42Guard)
  @Redirect('/')
  oauth42Login() {
    // Guard implementation
  }

  @Delete('logout')
  @UseGuards(AuthenticatedGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOkResponse({ description: 'Logout successfully' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  logout(@GetRequest() req: Request) {
    const sessionId = req.session.id;

    req.logout((err: Error) => {
      if (err) {
        throw new NotFoundException(err.message);
      }
      // disconnect all Socket.IO connections linked to this session ID
      if (this.socketService.socket) {
        this.socketService.socket.to(sessionId).disconnectSockets();
      }
    });
  }

  @Post('local/register')
  @ApiCreatedResponse({ description: 'Login successfully', type: User })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  async registerLocalUser(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<User> {
    const user = await this.authService.registerLocalUser(registerUserDto);

    if (!user) {
      throw new UnprocessableEntityException();
    }
    return user;
  }

  @Post('local/login')
  @UseGuards(LocalGuard)
  @ApiCreatedResponse({ description: 'Login successfully', type: User })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loginLocalUser(@Req() req: Request, @Body() user: LoginUserDto): User {
    return req.user;
  }
}
