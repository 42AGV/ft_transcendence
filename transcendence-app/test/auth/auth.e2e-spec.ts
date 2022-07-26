import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AuthModule } from '../../src/auth/auth.module';
import * as request from 'supertest';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  EnvironmentVariables,
  validate,
} from '../../src/config/env.validation';
import * as session from 'express-session';
import * as ConnectMemcached from 'connect-memcached';
import * as passport from 'passport';

describe('[Feature] Auth - /auth', () => {
  let app: INestApplication;
  let config: ConfigService<EnvironmentVariables>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
          cache: true,
          validate,
        }),
        AuthModule,
      ],
      controllers: [AuthController],
    }).compile();

    app = moduleFixture.createNestApplication();
    config =
      moduleFixture.get<ConfigService<EnvironmentVariables>>(ConfigService);

    const MemcachedStore = ConnectMemcached(session);
    const memcachedHost = config.get('MEMCACHED_HOST') as string;
    const memcachedPort = config.get('MEMCACHED_PORT') as string;

    app.use(
      session({
        secret: config.get('SESSION_SECRET') as string,
        resave: false,
        saveUninitialized: false,
        store: new MemcachedStore({
          hosts: [`${memcachedHost}:${memcachedPort}`],
          secret: config.get('MEMCACHED_SECRET'),
        }),
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.init();
  });

  it('Login [GET /login]', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/login')
      .expect(HttpStatus.FOUND);
    const authUrl = config.get('FORTYTWO_APP_AUTHORIZATION_URL');
    expect(response.headers['location']).toMatch(new RegExp(`^${authUrl}?`));
  });

  it('Logout [DELETE /logout]', async () => {
    return request(app.getHttpServer())
      .delete('/auth/logout')
      .expect(HttpStatus.FORBIDDEN);
  });

  afterAll(async () => {
    await app.close();
  });
});
