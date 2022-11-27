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
import { User as GetUser } from './decorators/user.decorator';
import { User } from './infrastructure/db/user.entity';
import LocalFileInterceptor from '../shared/local-file/local-file.interceptor';
import {
  AVATARS_PATH,
  AVATAR_MAX_SIZE,
  AVATAR_MIMETYPE_WHITELIST,
  MAX_ENTRIES_PER_PAGE,
} from '../shared/constants';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiFile } from '../shared/decorators/api-file.decorator';
import { UserAvatarResponseDto } from './dto/user.avatar.response.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { PaginationWithSearchQueryDto } from '../shared/dtos/pagination-with-search.query.dto';

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
  @ApiOkResponse({ description: 'Update the authenticated user', type: User })
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

  @Patch('/password')
  @ApiOkResponse({
    description: 'Update the authenticated user password',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  async updateCurrentUserPassword(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.userService.updateUserPassword(
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
    @Query() usersPaginationQueryDto: PaginationWithSearchQueryDto,
  ): Promise<User[]> {
    const users = await this.userService.retrieveUsers(usersPaginationQueryDto);
    if (!users) {
      throw new ServiceUnavailableException();
    }
    return users;
  }

  @Get(':userName')
  @ApiOkResponse({ description: 'Get a user', type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async getUserByUserName(
    @GetUser() userMe: User,
    @Param('userName') userName: string,
  ): Promise<UserResponseDto> {
    const user = await this.userService.retrieveUserWithUserName(
      userName,
      userMe,
    );
    if (user === null) {
      throw new NotFoundException();
    }
    return user;
  }

  @Put('avatar')
  @ApiConsumes('multipart/form-data')
  @ApiFile('file')
  @ApiProduces('image/jpeg')
  @ApiOkResponse({
    description: 'Update a user avatar',
    type: UserAvatarResponseDto,
  })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @ApiPayloadTooLargeResponse({ description: 'Payload Too Large' })
  @ApiServiceUnavailableResponse({ description: 'Service Unavailable' })
  @UseInterceptors(AvatarFileInterceptor)
  async uploadAvatar(
    @GetUser() user: User,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<UserAvatarResponseDto> {
    if (!file) {
      throw new UnprocessableEntityException();
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

  @Get('block/list')
  @ApiOkResponse({
    description: 'List users blocked by the authenticated user',
    type: [User],
  })
  @ApiServiceUnavailableResponse({ description: 'Service Unavailable' })
  async getBlocks(@GetUser() user: User): Promise<User[]> {
    const blockedUsers = await this.userService.getBlocks(user.id);
    if (!blockedUsers) {
      throw new ServiceUnavailableException();
    }
    return blockedUsers;
  }

  @Post('block/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Block a user' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  blockUser(
    @GetUser() user: User,
    @Param('userId', ParseUUIDPipe) blockedUserId: string,
  ): Promise<void> {
    return this.userService.addBlock(user.id, blockedUserId);
  }

  @Delete('block/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Unblock a user',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  unblockUser(
    @GetUser() user: User,
    @Param('userId', ParseUUIDPipe) blockedUserId: string,
  ): Promise<void> {
    return this.userService.deleteBlock(user.id, blockedUserId);
  }
}
