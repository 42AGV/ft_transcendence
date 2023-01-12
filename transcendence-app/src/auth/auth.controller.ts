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
  Request as GetRequest,
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
import { GlobalPoliciesGuard } from '../authorization/guards/global-policies.guard';
import { CheckPolicies } from '../authorization/decorators/policies.decorator';
import { Action } from '../shared/enums/action.enum';
import { SetSubjects } from '../authorization/decorators/set-subjects.decorator';
import { UserToRoleDto } from '../authorization/dto/user-to-role.dto';
import { UserToRole } from '../authorization/infrastructure/db/user-to-role.entity';
import { UserWithAuthorizationResponseDto } from '../authorization/dto/user-with-authorization.response.dto';
import { User as GetUser } from '../user/decorators/user.decorator';
import { GlobalAuthUserPipe } from '../authorization/decorators/global-auth-user.pipe';
import { UserWithAuthorization } from '../authorization/infrastructure/db/user-with-authorization.entity';
import { TwoFactorAuthenticationCodeDto } from './dto/two-factor-authentication-code.dto';
import { UserService } from '../user/user.service';
import { TwoFactorAuthenticatedGuard } from '../shared/guards/two-factor-authenticated.guard';
import {
  IS_TWO_FACTOR_AUTHENTICATED_COOKIE_NAME,
  IS_TWO_FACTOR_AUTHENTICATED_COOKIE_VALUE,
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
  oauth42Login() {
    // Guard implementation
  }

  @Delete('logout')
  @UseGuards(TwoFactorAuthenticatedGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOkResponse({ description: 'Logout successfully' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  logout(
    @GetRequest() req: Request,
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
      response.clearCookie(IS_TWO_FACTOR_AUTHENTICATED_COOKIE_NAME, {
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

  @Post('authorization')
  @UseGuards(TwoFactorAuthenticatedGuard)
  @SetSubjects(UserToRole)
  @UseGuards(GlobalPoliciesGuard)
  @CheckPolicies((ability, userToRole) =>
    ability.can(Action.Create, userToRole),
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Add a role to a user' })
  @ApiForbiddenResponse({
    description: 'Not authorized add this role',
  })
  @ApiUnprocessableEntityResponse({
    description: "The provided id doesn't match any user",
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async addRole(@Body() roleObj: UserToRoleDto): Promise<void> {
    await this.authorizationService.addUserToRole(roleObj);
  }

  @Delete('authorization')
  @UseGuards(TwoFactorAuthenticatedGuard)
  @SetSubjects(UserToRole)
  @UseGuards(GlobalPoliciesGuard)
  @CheckPolicies((ability, userToRole) =>
    ability.can(Action.Delete, userToRole),
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Remove a role from a user' })
  @ApiForbiddenResponse({
    description: 'Not authorized to remove this role',
  })
  @ApiNotFoundResponse({ description: 'Username to role relation not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async removeRole(@Body() roleObj: UserToRoleDto): Promise<void> {
    await this.authorizationService.deleteUserToRole(roleObj);
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

  @Post('2fa/generate')
  @UseGuards(TwoFactorAuthenticatedGuard)
  @Header('Content-Type', 'image/png')
  @Header('Content-Disposition', 'inline')
  @ApiProduces('image/png')
  @ApiCreatedResponse({
    schema: {
      type: 'file',
      format: 'binary',
    },
    description: 'Generate a QR code for TOTP 2FA',
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async twoFactorGenerate(@Res() response: Response, @GetUser() user: User) {
    const { otpAuthUrl } =
      await this.authService.generateTwoFactorAuthenticationSecret(user);
    return this.authService.pipeQrCodeStream(response, otpAuthUrl);
  }

  @Post('2fa')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(TwoFactorAuthenticatedGuard)
  @ApiNoContentResponse({ description: 'Enable 2FA' })
  @ApiBadRequestResponse({ description: 'Wrong authentication code' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiServiceUnavailableResponse({ description: 'Service Unavailable' })
  async enableTwoFactorAuthentication(
    @Res({ passthrough: true }) response: Response,
    @GetUser('id') userId: string,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isValidCode =
      await this.authService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        userId,
      );

    if (!isValidCode) {
      throw new BadRequestException('Wrong authentication code');
    }
    const updatedUser = await this.userService.enableTwoFactorAuthentication(
      userId,
    );
    if (!updatedUser) {
      throw new ServiceUnavailableException();
    }
    response.cookie(
      IS_TWO_FACTOR_AUTHENTICATED_COOKIE_NAME,
      IS_TWO_FACTOR_AUTHENTICATED_COOKIE_VALUE,
      { signed: true },
    );
  }

  @Delete('2fa')
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
    response.clearCookie(IS_TWO_FACTOR_AUTHENTICATED_COOKIE_NAME, {
      signed: true,
    });
  }

  @Post('2fa/validate')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedGuard)
  @ApiOkResponse({ description: 'Validate 2FA' })
  @ApiBadRequestResponse({ description: 'Wrong authentication code' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  validateTwoFactorAuthentication(
    @Res({ passthrough: true }) response: Response,
    @GetUser() user: User,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isValidCode = this.authService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCode,
      user.id,
    );
    if (!isValidCode) {
      throw new BadRequestException('Wrong authentication code');
    }
    response.cookie(
      IS_TWO_FACTOR_AUTHENTICATED_COOKIE_NAME,
      IS_TWO_FACTOR_AUTHENTICATED_COOKIE_VALUE,
      { signed: true },
    );
    return user;
  }
}
