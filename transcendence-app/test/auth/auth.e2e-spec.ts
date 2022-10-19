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
import { AuthService } from '../../src/auth/auth.service';
import { UserModule } from '../../src/user/user.module';
import { setupApp } from '../../src/setup-app';
import { EventsModule } from '../../src/events/events.module';

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
        UserModule,
        EventsModule,
      ],
      providers: [AuthService],
      controllers: [AuthController],
    }).compile();

    app = moduleFixture.createNestApplication();
    config =
      moduleFixture.get<ConfigService<EnvironmentVariables>>(ConfigService);
    setupApp(app);
    app.init();
  });

  it('Login [GET /login] should redirect to the 42 OAuth page', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/login')
      .expect(HttpStatus.FOUND);
    const authUrl = config.get('FORTYTWO_APP_AUTHORIZATION_URL');
    expect(response.headers['location']).toMatch(new RegExp(`^${authUrl}?`));
  });

  it('Logout [DELETE /logout] should throw the "ForbiddenException" when the user is not authenticated', async () => {
    return request(app.getHttpServer())
      .delete('/auth/logout')
      .expect(HttpStatus.FORBIDDEN);
  });

  afterAll(async () => {
    await app.close();
  });
});
