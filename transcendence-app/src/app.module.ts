import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { validate } from './config/env.validation';
import * as session from 'express-session';
import * as ConnectMemcached from 'connect-memcached';
import * as passport from 'passport';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
    }),
    AuthModule,
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const MemcachedStore = ConnectMemcached(session);

    consumer
      .apply(
        session({
          secret: this.configService.get('SESSION_SECRET') as string,
          resave: false,
          saveUninitialized: false,
          store: new MemcachedStore({
            hosts: ['memcached:11211'],
            secret: this.configService.get('MEMCACHED_SECRET'),
          }),
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
