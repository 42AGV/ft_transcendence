import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserDto } from './dto/user.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('new?')
  async addUser(@Query() query: UserDto): Promise<UserEntity> {
    const validatedUser = plainToClass(UserDto, query);
    const errors = await validate(validatedUser, {
      skipMissingProperties: false,
      forbidUnknownValues: true,
    });
    if (errors.length > 0) {
      throw new BadRequestException();
    }
    return this.userService.findOneOrCreate(query);
  }

  @Get(':id')
  async getUserById(@Param('id') param: string): Promise<UserEntity> {
    const result = this.userService.retrieveUserWithId(Number(param));
    if (result === undefined) throw new NotFoundException();
    return result;
  }
}
