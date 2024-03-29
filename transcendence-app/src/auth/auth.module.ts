import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalFileModule } from '../shared/local-file/local-file.module';
import { Api42Service } from '../user/api42.service';
import { UserModule } from '../user/user.module';
import { DbModule } from '../shared/db/db.module';
import { AuthProviderModule } from './auth-provider/auth-provider.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HTTP_TIMEOUT_MILLISECONDS } from '../shared/constants';
import { LocalStrategy } from './local.strategy';
import { OAuth42Strategy } from './oauth42.strategy';
import { SessionSerializer } from './session.serializer';
import { SocketModule } from '../socket/socket.module';
import { AuthorizationModule } from '../authorization/authorization.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: HTTP_TIMEOUT_MILLISECONDS,
    }),
    DbModule,
    UserModule,
    SocketModule,
    PassportModule.register({ session: true }),
    LocalFileModule,
    AuthProviderModule,
    AuthorizationModule,
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
