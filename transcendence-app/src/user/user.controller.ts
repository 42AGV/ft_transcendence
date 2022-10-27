import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { AuthenticatedGuard } from '../shared/guards/authenticated.guard';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiPayloadTooLargeResponse,
  ApiProduces,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { UsersPaginationQueryDto } from './dto/user.pagination.dto';
import { User as GetUser } from './decorators/user.decorator';
import { User } from './user.domain';
import LocalFileInterceptor from '../shared/local-file/local-file.interceptor';
import {
  AVATARS_PATH,
  AVATAR_MAX_SIZE,
  AVATAR_MIMETYPE_WHITELIST,
  MAX_ENTRIES_PER_PAGE,
} from '../shared/constants';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiFile } from '../shared/decorators/api-file.decorator';
import { UserAvatarDto } from './dto/user.avatar.dto';

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

  @Patch()
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  async updateCurrentUser(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.userService.updateUser(
      user.id,
      updateUserDto,
    );
    if (!updatedUser) {
      throw new UnprocessableEntityException();
    }
    return updatedUser;
  }

  @Get('me')
  @ApiOkResponse({ description: 'Get the authenticated user', type: User })
  getCurrentUser(@GetUser() user: User) {
    return user;
  }

  @Get()
  @ApiOkResponse({
    description: `Lists all users (max ${MAX_ENTRIES_PER_PAGE})`,
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

  @Get('avatars/:avatarId')
  @ApiProduces('image/jpeg')
  @ApiOkResponse({
    schema: {
      type: 'file',
      format: 'binary',
    },
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async getAvatarByAvatarId(
    @Param('avatarId', ParseUUIDPipe) id: string,
  ): Promise<StreamableFile> {
    const streamableFile = await this.userService.getAvatarByAvatarId(id);

    if (!streamableFile) {
      throw new NotFoundException();
    }
    return streamableFile;
  }

  @Get(':userName')
  @ApiOkResponse({ description: 'Get a user', type: User })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async getUserByUserName(@Param('userName') userName: string): Promise<User> {
    const user = await this.userService.retrieveUserWithUserName(userName);
    if (user === null) {
      throw new NotFoundException();
    }
    return user;
  }

  @Put('avatar')
  @ApiConsumes('multipart/form-data')
  @ApiFile('file')
  @ApiProduces('image/jpeg')
  @ApiOkResponse({ description: 'Update a user avatar', type: UserAvatarDto })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @ApiPayloadTooLargeResponse({ description: 'Payload Too Large' })
  @ApiServiceUnavailableResponse({ description: 'Service Unavailable' })
  @UseInterceptors(AvatarFileInterceptor)
  async uploadAvatar(
    @GetUser() user: User,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<UserAvatarDto> {
    if (!file) {
      throw new UnprocessableEntityException();
    }

    const isValid = await this.userService.validateAvatarType(file.path);
    if (!isValid) {
      const allowedTypes = AVATAR_MIMETYPE_WHITELIST.join(', ');
      throw new UnprocessableEntityException(
        `Validation failed (allowed types are ${allowedTypes})`,
      );
    }

    const avatar = await this.userService.addAvatar(user, {
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
    });

    if (!avatar) {
      throw new ServiceUnavailableException();
    }
    return avatar;
  }

  @Post('block/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Block a user' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  async blockUser(
    @GetUser() user: User,
    @Param('userId', ParseUUIDPipe) blockedUserId: string,
  ): Promise<void> {
    const block = await this.userService.addBlock(user.id, blockedUserId);
    if (!block) {
      throw new UnprocessableEntityException();
    }
  }

  @Get('block/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Check if a user is blocked by the authenticated user',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async getBlock(
    @GetUser() user: User,
    @Param('userId', ParseUUIDPipe) blockedUserId: string,
  ): Promise<void> {
    const block = await this.userService.getBlock(user.id, blockedUserId);
    if (!block) {
      throw new NotFoundException();
    }
  }

  @Delete('block/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Unblock a user',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async unblockUser(
    @GetUser() user: User,
    @Param('userId', ParseUUIDPipe) blockedUserId: string,
  ): Promise<void> {
    const block = await this.userService.deleteBlock(user.id, blockedUserId);
    if (!block) {
      throw new NotFoundException();
    }
  }
}
