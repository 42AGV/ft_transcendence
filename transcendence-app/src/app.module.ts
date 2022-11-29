import {
  ClassSerializerInterceptor,
  DynamicModule,
  Module,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { validate } from './config/env.validation';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SocketModule } from './socket/socket.module';
import { ChatModule } from './chat/chat.module';

@Module({})
export class AppModule {
  static register(): DynamicModule {
    return {
      module: AppModule,
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
      ],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: ClassSerializerInterceptor,
        },
      ],
    };
  }
}
