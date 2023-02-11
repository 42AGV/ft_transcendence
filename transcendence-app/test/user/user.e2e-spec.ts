import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from '../../src/user/user.module';
import { validate } from '../../src/config/env.validation';
import { UserController } from '../../src/user/user.controller';
import { TwoFactorAuthenticatedGuard } from '../../src/shared/guards/two-factor-authenticated.guard';
import { AuthorizationModule } from '../../src/authorization/authorization.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

describe('[Feature] User - /users', () => {
  let app: INestApplication;
  const canActivate = jest.fn(() => true);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        AuthorizationModule,
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
          cache: true,
          validate,
        }),
        EventEmitterModule.forRoot(),
      ],
      controllers: [UserController],
    })
      .overrideGuard(TwoFactorAuthenticatedGuard)
      .useValue({ canActivate })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        forbidUnknownValues: true,
      }),
    );
    await app.init();
  });

  it('Get all users [GET /]', async () => {
    const server = await app.getHttpServer();
    const response = await request(server)
      .get('/users/?limit=20&offset=0&sort=true')
      .expect(HttpStatus.OK);
    expect(response.body.length).toBe(20);
  });

  it('Get current user [GET /me]', () => {
    canActivate.mockReturnValueOnce(false);
    return request(app.getHttpServer())
      .get('/users/me')
      .expect(HttpStatus.FORBIDDEN);
  });

  afterAll(async () => {
    await app.close();
  });
});
