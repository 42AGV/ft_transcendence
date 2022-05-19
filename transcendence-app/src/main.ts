import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TypeormStore } from 'connect-typeorm/out';
import * as session from 'express-session';
import { getRepository } from 'typeorm';
import { AppModule } from './app.module';
import { SessionEntity } from './typeorm/session.entity';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  const sessionrepository = getRepository(SessionEntity);
  app.enable('trust proxy');
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(new ValidationPipe());
  const options = new DocumentBuilder()
    .setTitle('transcendence-app')
    .setDescription('The transcendence-app API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.use(
    session({
      secret: config.get('FORTYTWO_APP_SECRET') as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 300000,
      },
      store: new TypeormStore().connect(sessionrepository),
    }),
  );
  await app.listen(3000);
}
bootstrap();
