import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalFileModule } from '../shared/local-file/local-file.module';
import { Api42Service } from '../user/api42.service';
import { UserModule } from '../user/user.module';
import { DbModule } from 'src/shared/db/db.module';
import { AuthProviderModule } from './auth-provider/auth-provider.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HTTP_TIMEOUT_MILLISECONDS } from '../shared/constants';
import { LocalStrategy } from './local.strategy';
import { OAuth42Strategy } from './oauth42.strategy';
import { SessionSerializer } from './session.serializer';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: HTTP_TIMEOUT_MILLISECONDS,
    }),
    DbModule,
    UserModule,
    ChatModule,
    PassportModule.register({ session: true }),
    LocalFileModule,
    AuthProviderModule,
  ],
  controllers: [AuthController],
  providers: [
    OAuth42Strategy,
    Api42Service,
    SessionSerializer,
    AuthService,
    LocalStrategy,
  ],
})
export class AuthModule {}
