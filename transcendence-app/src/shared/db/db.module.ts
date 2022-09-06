import { Module } from '@nestjs/common';
import { PostgresPool } from './postgres/postgresConnection.provider';
import { IUserRepository } from '../../user/infrastructure/db/user.repository';
import { UserPostgresRepository } from '../../user/infrastructure/db/postgres/userPostgres.repository';
import { ILocalFileRepository } from '../local-file/infrastructure/db/local-file.repository';
import { LocalFilePostgresRepository } from '../local-file/infrastructure/db/postgres/local-file.postgres.repository';
import { AuthProviderPostgresRepository } from '../../auth/auth-provider/infrastructure/db/postgres/auth-provider.postgres.repository';
import { IAuthProviderRepository } from '../../auth/auth-provider/infrastructure/db/auth-provider.repository';

@Module({
  providers: [
    PostgresPool,
    { provide: IUserRepository, useClass: UserPostgresRepository },
    { provide: ILocalFileRepository, useClass: LocalFilePostgresRepository },
    {
      provide: IAuthProviderRepository,
      useClass: AuthProviderPostgresRepository,
    },
  ],
  exports: [IUserRepository, ILocalFileRepository, IAuthProviderRepository],
})
export class DbModule {}
