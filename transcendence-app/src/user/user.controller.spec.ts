import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from './user.module';

describe('User Controller', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
      controllers: [UserController],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should create a user', async () => {
    const server = app.getHttpServer();
    request(server)
      .post('/api/v1/user/1')
      .expect(HttpStatus.CREATED)
      .then(() => {
        request(server).get('/api/v1/user/1').expect(HttpStatus.OK);
      });
    request(server).get('/api/v1/user/2').expect(HttpStatus.NOT_FOUND);
  });

  afterAll(async () => {
    await app.close();
  });
});
