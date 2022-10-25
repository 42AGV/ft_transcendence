import { Module } from '@nestjs/common';
import { PostgresPool } from './postgres/postgresConnection.provider';
import { IUserRepository } from '../../user/infrastructure/db/user.repository';
import { UserPostgresRepository } from '../../user/infrastructure/db/postgres/userPostgres.repository';
import { ILocalFileRepository } from '../local-file/infrastructure/db/local-file.repository';
import { LocalFilePostgresRepository } from '../local-file/infrastructure/db/postgres/local-file.postgres.repository';
import { AuthProviderPostgresRepository } from '../../auth/auth-provider/infrastructure/db/postgres/auth-provider.postgres.repository';
import { IAuthProviderRepository } from '../../auth/auth-provider/infrastructure/db/auth-provider.repository';
import { IChatRepository } from '../../chat/infrastructure/db/chat.repository';
import { ChatPostgresRepository } from '../../chat/infrastructure/db/postgres/chatPostgres.repository';
import { IChatMemberRepository } from '../../chat/infrastructure/db/chatmember.repository';
import { ChatMemberPostgresRepository } from '../../chat/infrastructure/db/postgres/chatmember.postgres.repository';

@Module({
  providers: [
    PostgresPool,
    { provide: IUserRepository, useClass: UserPostgresRepository },
    { provide: ILocalFileRepository, useClass: LocalFilePostgresRepository },
    { provide: IChatRepository, useClass: ChatPostgresRepository },
    {
      provide: IAuthProviderRepository,
      useClass: AuthProviderPostgresRepository,
    },
    { provide: IChatMemberRepository, useClass: ChatMemberPostgresRepository },
  ],
  exports: [
    IUserRepository,
    ILocalFileRepository,
    IAuthProviderRepository,
    IChatRepository,
    IChatMemberRepository,
  ],
})
export class DbModule {}
