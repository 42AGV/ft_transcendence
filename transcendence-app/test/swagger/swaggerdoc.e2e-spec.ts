// my-api.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import { validate } from '../../src/config/env.validation';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../../src/user/user.module';
import { UserController } from '../../src/user/user.controller';
import { AuthenticatedGuard } from '../../src/shared/guards/authenticated.guard';
import * as yaml from 'yaml';
import { AuthModule } from '../../src/auth/auth.module';
import { SocketModule } from '../../src/socket/socket.module';
import { ChatModule } from '../../src/chat/chat.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ChatController } from '../../src/chat/chat.controller';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { LocalFileModule } from '../../src/shared/local-file/local-file.module';
import { ChatService } from '../../src/chat/chat.service';
import { ChatroomMemberService } from '../../src/chat/chatroom/chatroom-member/chatroom-member.service';
import { DbModule } from '../../src/shared/db/db.module';
import { AvatarModule } from '../../src/shared/avatar/avatar.module';

describe('[Feature] Swagger works', () => {
  let app: INestApplication;
  const specFilePath = './swagger-spec/swagger-spec.test.yaml';
  const canActivate = jest.fn(() => true);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
          cache: true,
          validate,
        }),
        UserModule,
        AuthModule,
        SocketModule,
        ChatModule,
        DbModule,
        LocalFileModule,
        AvatarModule,
      ],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: ClassSerializerInterceptor,
        },
        AuthService,
        ChatService,
        ChatroomMemberService,
      ],
      controllers: [AuthController, UserController, ChatController],
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
    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
    await app.init();
  });

  it('should generate swagger spec', async () => {
    const options = new DocumentBuilder()
      .setTitle('transcendence-app')
      .setDescription('The transcendence-app API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    const yamlString: string = yaml.stringify(document, {});
    fs.writeFileSync(specFilePath, yamlString);
  });

  afterAll(async () => {
    await app.close();
    fs.rmSync(specFilePath, { force: true });
  });
});
