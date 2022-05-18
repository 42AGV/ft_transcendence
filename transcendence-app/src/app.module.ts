import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OAuth42Module } from './oauth42/oauth42.module';
import { validate } from './config/env.validation';
import { DataProviderModule } from './shared/data-provider/data-provider.module';
import { PersistenceModule } from './shared/persistence/persistence.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
    }),
    OAuth42Module,
    DataProviderModule,
    PersistenceModule,
  ],
})
export class AppModule {}
