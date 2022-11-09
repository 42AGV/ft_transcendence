import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { AppModule } from './app.module';
import * as yaml from 'yaml';
import { setupApp } from './setup-app';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './config/env.validation';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enable('trust proxy');
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  setupApp(app);
  const options = new DocumentBuilder()
    .setTitle('transcendence-app')
    .setDescription('The transcendence-app API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  const configService =
    app.get<ConfigService<EnvironmentVariables>>(ConfigService);
  const nodeEnv = configService.get<string>('NODE_ENV');
  if (nodeEnv && nodeEnv !== 'production') {
    const yamlString: string = yaml.stringify(document, {});
    writeFileSync('./swagger-spec.yaml', yamlString);
  }
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
