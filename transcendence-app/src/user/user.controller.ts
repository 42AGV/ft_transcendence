import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Request as GetRequest,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserDto } from './dto/user.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthenticatedGuard } from '../shared/guards/authenticated.guard';
import { Request } from 'express';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@ApiForbiddenResponse()
@UseGuards(AuthenticatedGuard)
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

  @Get('me')
  getCurrentUser(@GetRequest() req: Request) {
    return req.user;
  }

  @Get(':id')
  async getUserById(@Param('id') param: string): Promise<UserEntity> {
    const result = this.userService.retrieveUserWithId(Number(param));
    if (result === null) throw new NotFoundException();
    return result;
  }
}
