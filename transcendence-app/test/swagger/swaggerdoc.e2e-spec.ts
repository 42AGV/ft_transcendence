// my-api.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import {
  EnvironmentVariables,
  validate,
} from '../../src/config/env.validation';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../../src/user/user.module';
import { UserController } from '../../src/user/user.controller';
import { AuthenticatedGuard } from '../../src/shared/guards/authenticated.guard';
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

  it('should generate swagger spec', async () => {
    const config = new DocumentBuilder()
      .setTitle('My API')
      .setDescription('My API')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    console.log(document);
    fs.writeFileSync('./swagger.json', JSON.stringify(document));
  });

  afterAll(async () => {
    await app.close();
  });
});
