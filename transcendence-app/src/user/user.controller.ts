import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Request as GetRequest,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserDto } from './dto/user.dto';
import { AuthenticatedGuard } from '../shared/guards/authenticated.guard';
import { Request } from 'express';
import { ApiBody, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';

const MAX_USER_ENTRIES_PER_PAGE = 20;

@ApiTags('user')
@ApiForbiddenResponse()
@UseGuards(AuthenticatedGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async addUser(@Body() user: UserDto): Promise<UserEntity> {
    return this.userService.findOneOrCreate(user);
  }

  @Get('me')
  getCurrentUser(@GetRequest() req: Request) {
    return req.user;
  }

  @Get('users')
  getUsers() {
    return this.userService.retrieveUsers();
  }

  @Get('usernames?')
  getUsernames(
    @Query('take', ParseIntPipe) take: number,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('sort', ParseBoolPipe) sort: boolean,
  ) {
    take = take > MAX_USER_ENTRIES_PER_PAGE ? MAX_USER_ENTRIES_PER_PAGE : take;
    return this.userService.retrieveUsernames(take, skip, sort);
  }

  @Get(':uuid')
  async getUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<UserEntity> {
    const result = this.userService.retrieveUserWithId(uuid);
    if (result === null) {
      throw new NotFoundException();
    }
    return result;
  }
}
