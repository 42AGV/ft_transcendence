import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EnvironmentVariables, validate } from './config/env.validation';
import * as session from 'express-session';
import * as ConnectMemcached from 'connect-memcached';
import * as passport from 'passport';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      cache: true,
      validate,
    }),
    AuthModule,
    ChatModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    ChatGateway,
  ],
})
export class AppModule {
  constructor(private configService: ConfigService<EnvironmentVariables>) {}

  configure(consumer: MiddlewareConsumer) {
    const MemcachedStore = ConnectMemcached(session);
    const memcachedHost = this.configService.get('MEMCACHED_HOST') as string;
    const memcachedPort = this.configService.get('MEMCACHED_PORT') as string;

    consumer
      .apply(
        session({
          secret: this.configService.get('SESSION_SECRET') as string,
          resave: false,
          saveUninitialized: false,
          store: new MemcachedStore({
            hosts: [`${memcachedHost}:${memcachedPort}`],
            secret: this.configService.get('MEMCACHED_SECRET'),
          }),
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
