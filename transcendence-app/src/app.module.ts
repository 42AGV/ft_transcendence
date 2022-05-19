import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OAuth42Module } from './oauth42/oauth42.module';
import { validate } from './config/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './typeorm/user.entity';
import { SessionEntity } from './typeorm/session.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
    }),
    OAuth42Module,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'transcendence',
      password: 'example',
      database: 'transcendence',
      entities: [UserEntity, SessionEntity],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
