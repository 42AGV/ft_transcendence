import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Api42Service } from '../user/api42.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { OAuth42Strategy } from './oauth42.strategy';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [HttpModule, UserModule, PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [OAuth42Strategy, Api42Service, SessionSerializer],
})
export class AuthModule {}
