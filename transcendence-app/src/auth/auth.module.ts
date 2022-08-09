import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalFileModule } from '../shared/local-file/local-file.module';
import { Api42Service } from '../user/api42.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { OAuth42Strategy } from './oauth42.strategy';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
    }),
    UserModule,
    PassportModule.register({ session: true }),
    LocalFileModule,
  ],
  controllers: [AuthController],
  providers: [OAuth42Strategy, Api42Service, SessionSerializer],
})
export class AuthModule {}
