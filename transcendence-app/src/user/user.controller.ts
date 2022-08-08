import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  ServiceUnavailableException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { AuthenticatedGuard } from '../shared/guards/authenticated.guard';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  MAX_USER_ENTRIES_PER_PAGE,
  UsersPaginationQueryDto,
} from './dto/user.pagination.dto';
import { User as GetUser } from './decorators/user.decorator';
import { User } from './user.domain';
import LocalFileInterceptor from '../shared/local-file/local-file.interceptor';
import {
  AVATARS_PATH,
  AVATAR_MAX_SIZE,
  AVATAR_MIMETYPE_WHITELIST,
} from './constants';

export const AvatarFileInterceptor = LocalFileInterceptor({
  fieldName: 'file',
  path: AVATARS_PATH,
  fileFilter: (request, file, callback) => {
    if (!AVATAR_MIMETYPE_WHITELIST.includes(file.mimetype)) {
      const allowedTypes = AVATAR_MIMETYPE_WHITELIST.join(', ');
      return callback(
        new UnprocessableEntityException(
          `Validation failed (allowed types are ${allowedTypes})`,
        ),
        false,
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: AVATAR_MAX_SIZE,
  },
});

@Controller('users')
@UseGuards(AuthenticatedGuard)
@ApiTags('users')
@ApiForbiddenResponse({ description: 'Forbidden' })
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Create a user', type: User })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable entity' })
  async addUser(@Body() userDto: UserDto): Promise<User> {
    let user = await this.userService.retrieveUserWithUserName(
      userDto.username,
    );
    if (user) {
      throw new UnprocessableEntityException();
    }
    user = await this.userService.addUser(userDto);
    if (!user) {
      throw new UnprocessableEntityException();
    }
    return user;
  }

  @Get('me')
  @ApiOkResponse({ description: 'Get the authenticated user', type: User })
  getCurrentUser(@GetUser() user: User) {
    return user;
  }

  @Get()
  @ApiOkResponse({
    description: `Lists all users (max ${MAX_USER_ENTRIES_PER_PAGE})`,
    type: [User],
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async getUsers(
    @Query() usersPaginationQueryDto: UsersPaginationQueryDto,
  ): Promise<User[]> {
    const users = await this.userService.retrieveUsers(usersPaginationQueryDto);
    if (!users) {
      throw new ServiceUnavailableException();
    }
    return users;
  }

  @Get(':uuid')
  @ApiOkResponse({ description: 'Get a user', type: User })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async getUserById(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<User> {
    const user = await this.userService.retrieveUserWithId(uuid);
    if (user === null) {
      throw new NotFoundException();
    }
    return user;
  }
}
