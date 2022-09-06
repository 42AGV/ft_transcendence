import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalFileModule } from '../shared/local-file/local-file.module';
import { Api42Service } from '../user/api42.service';
import { UserModule } from '../user/user.module';
import { AuthProviderModule } from './auth-provider/auth-provider.module';
import { AuthController } from './auth.controller';
import { HTTP_TIMEOUT_MILLISECONDS } from './constants';
import { OAuth42Strategy } from './oauth42.strategy';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [
    HttpModule.register({
      timeout: HTTP_TIMEOUT_MILLISECONDS,
    }),
    UserModule,
    PassportModule.register({ session: true }),
    LocalFileModule,
    AuthProviderModule,
  ],
  controllers: [AuthController],
  providers: [OAuth42Strategy, Api42Service, SessionSerializer],
})
export class AuthModule {}
