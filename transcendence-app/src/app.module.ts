import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { validate } from './config/env.validation';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventsModule } from './events/events.module';
import { ChatRoomModule } from './chat-room/chat-room.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      cache: true,
      validate,
    }),
    AuthModule,
    EventsModule,
    ChatRoomModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
