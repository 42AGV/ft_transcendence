import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OAuth42Module } from './oauth42/oauth42.module';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
    }),
    OAuth42Module,
  ],
})
export class AppModule {}
