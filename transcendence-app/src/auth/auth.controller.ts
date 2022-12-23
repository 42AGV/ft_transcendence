import {
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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiFoundResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
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
import { AuthorizationService } from '../authorization/authorization.service';
import { GlobalPoliciesGuard } from '../authorization/guards/global-policies.guard';
import { CheckPolicies } from '../authorization/decorators/policies.decorator';
import { Action } from '../shared/enums/action.enum';
import { SetSubjects } from '../authorization/decorators/set-subjects.decorator';
import { UserToRoleDto } from '../authorization/dto/user-to-role.dto';
import { UserToRole } from '../authorization/infrastructure/db/user-to-role.entity';
import { UserWithAuthorizationResponseDto } from '../authorization/dto/user-with-authorization.response.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly socketService: SocketService,
    private readonly authorizationService: AuthorizationService,
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

  @Post('authorization/role')
  @SetSubjects(UserToRole)
  @UseGuards(GlobalPoliciesGuard)
  @CheckPolicies((ability, userToRole) =>
    ability.can(Action.Create, userToRole),
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Add a role to a user' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable entity' })
  async addRole(@Body() roleObj: UserToRoleDto): Promise<void> {
    await this.authorizationService.addUserToRole(roleObj);
  }

  @Delete('authorization/role')
  @SetSubjects(UserToRole)
  @UseGuards(GlobalPoliciesGuard)
  @CheckPolicies((ability, userToRole) =>
    ability.can(Action.Delete, userToRole),
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Remove a role from a user' })
  @ApiUnauthorizedResponse({
    description: 'Not authorized to remove this role',
  })
  @ApiNotFoundResponse({ description: 'Username to role relation not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable entity' })
  async removeRole(@Body() roleObj: UserToRoleDto): Promise<void> {
    await this.authorizationService.deleteUserToRole(roleObj);
  }

  @Get('authorization/role/:username')
  @UseGuards(GlobalPoliciesGuard)
  @CheckPolicies((ability) =>
    ability.can(Action.Read, UserWithAuthorizationResponseDto),
  )
  @ApiOkResponse({
    description: 'Retrieve user with roles',
    type: UserWithAuthorizationResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Username not found' })
  @ApiUnauthorizedResponse({ description: 'Not authorized to read roles' })
  async retrieveUserWithRoles(
    @Param('username') username: string,
  ): Promise<UserWithAuthorizationResponseDto> {
    return this.authorizationService.getUserWithAuthorizationResponseDtoFromUsername(
      username,
    );
  }
}
