import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { OAuth42Controller } from './oauth42.controller';
import { OAuth42Strategy } from './oauth42.strategy';

@Module({
  imports: [HttpModule, UsersModule],
  controllers: [OAuth42Controller],
  providers: [OAuth42Strategy],
})
export class OAuth42Module {}
