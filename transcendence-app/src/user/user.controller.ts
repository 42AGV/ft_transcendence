import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserDto } from './dto/user.dto';
import { AuthenticatedGuard } from '../shared/guards/authenticated.guard';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  MAX_USER_ENTRIES_PER_PAGE,
  UsersPaginationQueryDto,
} from './dto/user.pagination.dto';
import { User as GetUser } from './decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiFile } from './decorators/api-file.decorator';

@ApiTags('users')
@ApiForbiddenResponse({ description: 'Forbidden' })
@UseGuards(AuthenticatedGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Create a user' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async addUser(@Body() user: UserDto): Promise<UserEntity> {
    return this.userService.findOneOrCreate(user);
  }

  @Get('me')
  @ApiOkResponse({ description: 'Get the authenticated user' })
  getCurrentUser(@GetUser() user: UserEntity) {
    return user;
  }

  @Get()
  @ApiOkResponse({
    description: `Lists all users (max ${MAX_USER_ENTRIES_PER_PAGE})`,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  getUsers(@Query() usersPaginationQueryDto: UsersPaginationQueryDto) {
    return this.userService.retrieveUsers(usersPaginationQueryDto);
  }

  @Get(':uuid')
  @ApiOkResponse({ description: 'Get a user' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async getUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<UserEntity> {
    const result = this.userService.retrieveUserWithId(uuid);
    if (result === null) {
      throw new NotFoundException();
    }
    return result;
  }

  @Post(':uuid/avatar')
  @ApiConsumes('multipart/form-data')
  @ApiFile('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './upload/avatars',
      }),
    }),
  )
  uploadAvatar(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    console.log(uuid, avatar);
  }
}
