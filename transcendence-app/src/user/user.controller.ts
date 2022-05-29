import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
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
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { UsersPaginationQueryDto } from './dto/user.pagination.dto';

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
  getUsers(@Query() usersPaginationQueryDto: UsersPaginationQueryDto) {
    return this.userService.retrieveUsers(usersPaginationQueryDto);
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
