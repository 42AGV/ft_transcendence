import { HttpStatus, INestApplication } from '@nestjs/common';
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
  avatar_id: null,
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
    await app.init();
  });

  it('should create a user', async () => {
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

  it('should return an array of usernames', async () => {
    const server = await app.getHttpServer();
    for (let i = 0; i < 50; i++) {
      await request(server)
        .post('/users')
        .send({
          username: 'user' + i,
          email: i + 'afgv@github.com',
          avatar_id: null,
        });
    }
    const response = await request(server)
      .get('/users/?limit=20&offset=0&sort=true')
      .expect(HttpStatus.OK);
    expect(response.body.length).toBe(20);
    await request(server).get('/users/').expect(HttpStatus.OK);
  });

  it('returns forbidden if guard fails', () => {
    canActivate.mockReturnValueOnce(false);
    return request(app.getHttpServer())
      .get('/users/me')
      .expect(HttpStatus.FORBIDDEN);
  });

  afterAll(async () => {
    await app.close();
  });
});
