import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OAuth42Module } from './oauth42/oauth42.module';
import { validate } from './config/env.validation';
// import { UserEntity } from './user/user.entity';
// import { TypeDBModule } from '@afgv/db';

@Module({
  imports: [
    // TypeDBModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: 'root',
    //   database: 'test',
    //   entities: [UserEntity],
    //   synchronize: true,
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
    }),
    OAuth42Module,
  ],
})
export class AppModule {}
