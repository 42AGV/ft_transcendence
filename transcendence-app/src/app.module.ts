import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';

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
    AuthModule,
  ],
})
export class AppModule {}
