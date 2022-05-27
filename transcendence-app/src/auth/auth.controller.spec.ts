import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AuthModule } from './auth.module';
import * as request from 'supertest';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from '../config/env.validation';
import { OAuth42Config } from './oauth42-config.interface';

describe('Auth Controller', () => {
  let app: INestApplication;
  let config: ConfigService<OAuth42Config>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.sample',
          isGlobal: true,
          cache: true,
          validate,
        }),
        AuthModule,
      ],
      controllers: [AuthController],
    }).compile();

    config = module.get<ConfigService<OAuth42Config>>(ConfigService);
    app = module.createNestApplication();
    app.init();
  });

  it('should redirect to 42 oauth page', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/login')
      .expect(HttpStatus.FOUND);
    const authUrl = config.get('FORTYTWO_APP_AUTHORIZATION_URL');
    expect(response.headers['location']).toMatch(new RegExp(`^${authUrl}?`));
  });

  afterAll(async () => {
    await app.close();
  });
});
