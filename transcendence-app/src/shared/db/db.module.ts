import { Module } from '@nestjs/common';
import { PostgresPool } from './postgres/postgresConnection.provider';
import { IUserRepository } from 'src/user/infrastructure/db/user.repository';
import { UserPostgresRepository } from 'src/user/infrastructure/db/postgres/userPostgres.repository';

@Module({
  providers: [
    PostgresPool,
    { provide: IUserRepository, useClass: UserPostgresRepository },
  ],
  exports: [IUserRepository],
})
export class DbModule {}
