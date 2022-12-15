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
import { MAX_ENTRIES_PER_PAGE } from '../shared/constants';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiFile } from '../shared/decorators/api-file.decorator';
import { UserResponseDto } from './dto/user.response.dto';
import { PaginationWithSearchQueryDto } from '../shared/dtos/pagination-with-search.query.dto';
import { Friend } from './infrastructure/db/friend.entity';
import { AvatarFileInterceptor } from '../shared/avatar/interceptors/avatar.file.interceptor';

@Controller()
@UseGuards(AuthenticatedGuard)
@ApiTags('users')
@ApiForbiddenResponse({ description: 'Forbidden' })
export class UserController {
  constructor(private userService: UserService) {}

  @Patch('user')
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

  @Get('user')
  @ApiOkResponse({ description: 'Get the authenticated user', type: User })
  getCurrentUser(@GetUser() user: User) {
    return user;
  }

  @Get('users')
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

  @Get('users/:userName')
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

  @Put('user/avatar')
  @ApiConsumes('multipart/form-data')
  @ApiFile('file')
  @ApiProduces('image/jpeg')
  @ApiOkResponse({
    description: 'Update a user avatar',
    type: User,
  })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @ApiPayloadTooLargeResponse({ description: 'Payload Too Large' })
  @ApiServiceUnavailableResponse({ description: 'Service Unavailable' })
  @UseInterceptors(AvatarFileInterceptor)
  async uploadAvatar(
    @GetUser() user: User,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<User> {
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

  @Get('user/block')
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

  @Post('user/block/:userId')
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

  @Delete('user/block/:userId')
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

  @Get('user/friend/:userId')
  @ApiOkResponse({
    description: 'Check if the current user follows another one',
    type: [Friend],
  })
  @ApiNotFoundResponse({ description: 'Service Unavailable' })
  async getFriend(
    @GetUser() user: User,
    @Param('userId', ParseUUIDPipe) followedUserId: string,
  ): Promise<Friend> {
    const friend = await this.userService.getFriend(user.id, followedUserId);
    if (!friend) {
      throw new NotFoundException();
    }
    return friend;
  }

  @Get('user/friends')
  @ApiOkResponse({
    description: 'List friends of the current user',
    type: [User],
  })
  @ApiServiceUnavailableResponse({ description: 'Service Unavailable' })
  async getFriends(
    @GetUser() user: User,
    @Query() usersPaginationQueryDto: PaginationWithSearchQueryDto,
  ): Promise<User[]> {
    const friends = await this.userService.getFriends(
      user.id,
      usersPaginationQueryDto,
    );
    if (!friends) {
      throw new ServiceUnavailableException();
    }
    return friends;
  }

  @Post('user/friend/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Follow a user' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  followUser(
    @GetUser() user: User,
    @Param('userId', ParseUUIDPipe) followedUserId: string,
  ): Promise<Friend> {
    return this.userService.addFriend(user.id, followedUserId);
  }

  @Delete('user/friend/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Unfollow a user',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  unfollowUser(
    @GetUser() user: User,
    @Param('userId', ParseUUIDPipe) followedUserId: string,
  ): Promise<Friend> {
    return this.userService.deleteFriend(user.id, followedUserId);
  }
}
