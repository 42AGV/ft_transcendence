import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { AppModule } from './app.module';
import * as yaml from 'yaml';
import { setupApp } from './setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule.register());
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
  const yamlString: string = yaml.stringify(document, {});
  writeFileSync('./swagger-spec/swagger-spec.yaml', yamlString);
  app.close();
}
bootstrap();
