import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { validate } from './config/env.validation';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SocketModule } from './socket/socket.module';
import { ChatModule } from './chat/chat.module';
import { AuthorizationModule } from './shared/authorization/authorization.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      cache: true,
      validate,
    }),
    AuthModule,
    SocketModule,
    ChatModule,
    AuthorizationModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
