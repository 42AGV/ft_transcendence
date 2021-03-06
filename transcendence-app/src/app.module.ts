import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EnvironmentVariables, validate } from './config/env.validation';
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
