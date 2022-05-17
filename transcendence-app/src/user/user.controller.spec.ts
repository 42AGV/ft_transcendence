import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from './user.module';

let app: INestApplication;

describe('User Controller', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
      controllers: [UserController],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should create a user', async () => {
    request(app.getHttpServer())
      .post('/api/v1/user/1')
      .expect(HttpStatus.CREATED);
    request(app.getHttpServer())
      .post('/api/v1/user/2')
      .expect(HttpStatus.CREATED);
  });

  afterAll(async () => {
    await app.close();
  });
});
