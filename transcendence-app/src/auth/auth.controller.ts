import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Redirect,
  Req,
  UnprocessableEntityException,
  UseGuards,
  Res,
  Header,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiFoundResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProduces,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { SocketService } from '../socket/socket.service';
import { AuthenticatedGuard } from '../shared/guards/authenticated.guard';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './local.guard';
import { OAuth42Guard } from './oauth42.guard';
import { User } from '../user/infrastructure/db/user.entity';
import { AuthorizationService } from '../authorization/authorization.service';
import { UserWithAuthorizationResponseDto } from '../authorization/dto/user-with-authorization.response.dto';
import { User as GetUser } from '../user/decorators/user.decorator';
import { GlobalAuthUserPipe } from '../authorization/decorators/global-auth-user.pipe';
import { UserWithAuthorization } from '../authorization/infrastructure/db/user-with-authorization.entity';
import { TwoFactorAuthenticationCodeDto } from './dto/two-factor-authentication-code.dto';
import { UserService } from '../user/user.service';
import { TwoFactorAuthenticatedGuard } from '../shared/guards/two-factor-authenticated.guard';
import {
  USER_IS_TWO_FACTOR_AUTHENTICATED_COOKIE_NAME,
  USER_IS_TWO_FACTOR_AUTHENTICATED_COOKIE_VALUE,
} from '../shared/constants';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly socketService: SocketService,
    private readonly authorizationService: AuthorizationService,
    private readonly userService: UserService,
  ) {}

  @Get('login')
  @ApiOkResponse({ description: 'Login successfully' })
  @ApiFoundResponse({ description: 'Redirect to 42 OAuth server' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  @UseGuards(OAuth42Guard)
  @Redirect('/')
  oauth42Login(@GetUser() user: User) {
    if (user.isTwoFactorAuthenticationEnabled) {
      return { url: '/login/2fa' };
    }
  }

  @Delete('logout')
  @UseGuards(TwoFactorAuthenticatedGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOkResponse({ description: 'Logout successfully' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  logout(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
    @GetUser() user: User,
  ) {
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
    if (user.isTwoFactorAuthenticationEnabled) {
      response.clearCookie(USER_IS_TWO_FACTOR_AUTHENTICATED_COOKIE_NAME, {
        signed: true,
      });
    }
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

  @Get('authorization/:username')
  @UseGuards(TwoFactorAuthenticatedGuard)
  @ApiOkResponse({
    description: 'Retrieve user with roles',
    type: UserWithAuthorizationResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Username not found' })
  @ApiForbiddenResponse({ description: 'Not authorized to read roles' })
  async retrieveUserWithRoles(
    @Param('username') destUsername: string,
    @GetUser('id', GlobalAuthUserPipe)
    authUser: UserWithAuthorization | null,
  ): Promise<UserWithAuthorizationResponseDto> {
    if (!authUser) {
      throw new BadRequestException();
    }
    return this.authorizationService.getUserWithAuthorizationResponseDtoFromUsername(
      destUsername,
      authUser,
    );
  }

  @Get('authorization')
  @UseGuards(TwoFactorAuthenticatedGuard)
  @ApiOkResponse({
    description: 'Retrieve authenticated user with roles',
    type: UserWithAuthorizationResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Username not found' })
  @ApiForbiddenResponse({ description: 'Not authorized to read roles' })
  async retrieveAuthUserWithRoles(
    @GetUser('username')
    authUserUsername: string,
    @GetUser('id', GlobalAuthUserPipe)
    authUser: UserWithAuthorization | null,
  ): Promise<UserWithAuthorizationResponseDto> {
    if (!authUser) {
      throw new BadRequestException();
    }
    return this.authorizationService.getUserWithAuthorizationResponseDtoFromUsername(
      authUserUsername,
      authUser,
    );
  }

  @Get('2fa/qrcode')
  @UseGuards(TwoFactorAuthenticatedGuard)
  @Header('Content-Type', 'image/png')
  @Header('Content-Disposition', 'inline')
  @Header('Cache-Control', 'no-cache')
  @Header('Expires', '0')
  @ApiProduces('image/png')
  @ApiOkResponse({
    schema: {
      type: 'file',
      format: 'binary',
    },
    description: 'Display a QR code for TOTP 2FA',
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async twoFactorQrCode(@Res() response: Response, @GetUser() user: User) {
    const { otpAuthUrl } =
      await this.authService.generateTwoFactorAuthenticationSecret(user);
    return this.authService.pipeQrCodeStream(response, otpAuthUrl);
  }

  @Post('2fa/enable')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(TwoFactorAuthenticatedGuard)
  @ApiNoContentResponse({ description: 'Enable 2FA' })
  @ApiBadRequestResponse({ description: 'Wrong authentication code' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiServiceUnavailableResponse({ description: 'Service Unavailable' })
  async enableTwoFactorAuthentication(
    @Res({ passthrough: true }) response: Response,
    @GetUser() user: User,
    @Body() { code }: TwoFactorAuthenticationCodeDto,
  ) {
    const isValidCode = this.authService.isTwoFactorAuthenticationCodeValid(
      code,
      user,
    );

    if (!isValidCode) {
      throw new BadRequestException('Wrong authentication code');
    }
    const updatedUser = await this.userService.enableTwoFactorAuthentication(
      user.id,
    );
    if (!updatedUser) {
      throw new ServiceUnavailableException();
    }
    response.cookie(
      USER_IS_TWO_FACTOR_AUTHENTICATED_COOKIE_NAME,
      USER_IS_TWO_FACTOR_AUTHENTICATED_COOKIE_VALUE,
      { signed: true },
    );
  }

  @Delete('2fa/disable')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(TwoFactorAuthenticatedGuard)
  @ApiNoContentResponse({ description: 'Disable 2FA' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiServiceUnavailableResponse({ description: 'Service Unavailable' })
  async disableTwoFactorAuthentication(
    @Res({ passthrough: true }) response: Response,
    @GetUser() user: User,
  ) {
    if (!user.isTwoFactorAuthenticationEnabled) {
      throw new NotFoundException();
    }
    const updatedUser = await this.userService.disableTwoFactorAuthentication(
      user.id,
    );
    if (!updatedUser) {
      throw new ServiceUnavailableException();
    }
    response.clearCookie(USER_IS_TWO_FACTOR_AUTHENTICATED_COOKIE_NAME, {
      signed: true,
    });
  }

  @Post('2fa/validate')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedGuard)
  @ApiOkResponse({ description: 'Validate 2FA', type: User })
  @ApiBadRequestResponse({ description: 'Wrong authentication code' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  validateTwoFactorAuthentication(
    @Res({ passthrough: true }) response: Response,
    @GetUser() user: User,
    @Body()
    { code }: TwoFactorAuthenticationCodeDto,
  ): User {
    const isValidCode = this.authService.isTwoFactorAuthenticationCodeValid(
      code,
      user,
    );
    if (!isValidCode) {
      throw new BadRequestException('Wrong authentication code');
    }
    response.cookie(
      USER_IS_TWO_FACTOR_AUTHENTICATED_COOKIE_NAME,
      USER_IS_TWO_FACTOR_AUTHENTICATED_COOKIE_VALUE,
      { signed: true },
    );
    return user;
  }
}
