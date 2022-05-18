import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { Api42Service } from '../user/api42.service';
import { UserModule } from '../user/user.module';
import { OAuth42Controller } from './oauth42.controller';
import { OAuth42Strategy } from './oauth42.strategy';

@Module({
  imports: [HttpModule, UserModule],
  controllers: [OAuth42Controller],
  providers: [OAuth42Strategy, Api42Service],
})
export class OAuth42Module {}
