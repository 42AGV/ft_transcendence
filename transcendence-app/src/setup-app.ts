import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as ConnectMemcached from 'connect-memcached';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './config/env.validation';
import { WsSessionAdapter } from './shared/adapters/ws-session.adapter';

export const setupApp = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      forbidUnknownValues: true,
    }),
  );
  const MemcachedStore = ConnectMemcached(session);
  const config = app.get(ConfigService<EnvironmentVariables>);
  const memcachedHost = config.get('MEMCACHED_HOST') as string;
  const memcachedPort = config.get('MEMCACHED_PORT') as string;
  const sessionMiddleware = session({
    secret: config.get('SESSION_SECRET') as string,
    resave: false,
    saveUninitialized: false,
    store: new MemcachedStore({
      hosts: [`${memcachedHost}:${memcachedPort}`],
      secret: config.get('MEMCACHED_SECRET'),
    }),
  });
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  app.useWebSocketAdapter(new WsSessionAdapter(app, sessionMiddleware));
};
