import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { OAuth42Module } from './oauth42/oauth42.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        FORTYTWO_APP_ID: Joi.string().required(),
        FORTYTWO_APP_SECRET: Joi.string().required(),
        FORTYTWO_APP_CALLBACK_URL: Joi.string().uri().required(),
      }),
    }),
    OAuth42Module,
  ],
})
export class AppModule {}
