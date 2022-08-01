import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  ServiceUnavailableException,
  StreamableFile,
  UnprocessableEntityException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { AuthenticatedGuard } from '../shared/guards/authenticated.guard';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProduces,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  MAX_USER_ENTRIES_PER_PAGE,
  UsersPaginationQueryDto,
} from './dto/user.pagination.dto';
import { User as GetUser } from './decorators/user.decorator';
import { ApiFile } from './decorators/api-file.decorator';
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
  @ApiBadRequestResponse({ description: 'Bad request' })
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

  @Put('avatar')
  @ApiConsumes('multipart/form-data')
  @ApiFile('file')
  @ApiProduces('image/jpeg')
  @ApiOkResponse({
    schema: {
      type: 'file',
      format: 'binary',
    },
  })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable entity' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  @UseInterceptors(AvatarFileInterceptor)
  async uploadAvatar(
    @GetUser() user: User,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<StreamableFile> {
    if (!file) {
      throw new UnprocessableEntityException();
    }

    const updatedUser = await this.userService.addAvatar(user, {
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
    });

    if (!updatedUser) {
      throw new ServiceUnavailableException();
    }
    return updatedUser;
  }

  @Get('avatar')
  @ApiProduces('image/jpeg')
  @ApiOkResponse({
    schema: {
      type: 'file',
      format: 'binary',
    },
  })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async getCurrentUserAvatar(@GetUser() user: User): Promise<StreamableFile> {
    const streamableFile = await this.userService.getAvatar(user.id);

    if (!streamableFile) {
      throw new NotFoundException();
    }
    return streamableFile;
  }

  @Get(':uuid/avatar')
  @ApiProduces('image/jpeg')
  @ApiOkResponse({
    schema: {
      type: 'file',
      format: 'binary',
    },
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async getAvatar(
    @Param('uuid', ParseUUIDPipe) id: string,
  ): Promise<StreamableFile> {
    const streamableFile = await this.userService.getAvatar(id);

    if (!streamableFile) {
      throw new NotFoundException();
    }
    return streamableFile;
  }

  @Get(':uuid')
  @ApiOkResponse({ description: 'Get a user', type: User })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async getUserById(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<User> {
    const user = await this.userService.retrieveUserWithId(uuid);
    if (user === null) {
      throw new NotFoundException();
    }
    return user;
  }
}
