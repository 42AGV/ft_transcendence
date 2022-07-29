import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from '../../src/user/user.module';
import { v4 as uuidv4 } from 'uuid';
import { validate } from '../../src/config/env.validation';
import { UserController } from '../../src/user/user.controller';
import { AuthenticatedGuard } from '../../src/shared/guards/authenticated.guard';
import { UserDto } from '../../src/user/dto/user.dto';

const testUserDto: UserDto = {
  username: 'user',
  email: 'afgv@github.com',
  avatarId: null,
};
const testUserId = uuidv4();

describe('[Feature] User - /users', () => {
  let app: INestApplication;
  const canActivate = jest.fn(() => true);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
          cache: true,
          validate,
        }),
      ],
      controllers: [UserController],
    })
      .overrideGuard(AuthenticatedGuard)
      .useValue({ canActivate })
      .compile();

    app = moduleFixture.createNestApplication();
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
    await app.init();
  });

  it('Creates an user [POST /]', async () => {
    const server = await app.getHttpServer();
    const response = await request(server)
      .post('/users')
      .send(testUserDto)
      .expect(HttpStatus.CREATED);
    await request(server)
      .get(`/users/${response.body.id}`)
      .expect(HttpStatus.OK);
    await request(server)
      .get(`/users/${testUserId}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('Get all users [GET /]', async () => {
    const server = await app.getHttpServer();
    for (let i = 0; i < 50; i++) {
      await request(server)
        .post('/users')
        .send({
          username: 'user' + i,
          email: i + 'afgv@github.com',
          avatarId: null,
        });
    }
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
