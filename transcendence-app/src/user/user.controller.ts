import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RouteGuard } from '../shared/guards/route.guard';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.userService.findOne(username);
  }

  @Get()
  @UseGuards(RouteGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Post('create')
  create(@Body() userDto: UserDto) {
    return this.userService.create(userDto);
  }

  @Post('findorcreate/:username')
  findOneOrCreate(@Body() userDto: UserDto) {
    return this.userService.findOneOrCreate(userDto);
  }

  @Delete(':username')
  delete(@Param('username') username: string) {
    return this.userService.delete(username);
  }
}
