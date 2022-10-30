import { Module } from '@nestjs/common';
import { PostgresPool } from './postgres/postgresConnection.provider';
import { IUserRepository } from '../../user/infrastructure/db/user.repository';
import { UserPostgresRepository } from '../../user/infrastructure/db/postgres/userPostgres.repository';
import { ILocalFileRepository } from '../local-file/infrastructure/db/local-file.repository';
import { LocalFilePostgresRepository } from '../local-file/infrastructure/db/postgres/local-file.postgres.repository';
import { AuthProviderPostgresRepository } from '../../auth/auth-provider/infrastructure/db/postgres/auth-provider.postgres.repository';
import { IAuthProviderRepository } from '../../auth/auth-provider/infrastructure/db/auth-provider.repository';
import { IBlockRepository } from '../../user/infrastructure/db/block.repository';
import { BlockPostgresRepository } from '../../user/infrastructure/db/postgres/block.postgres.repository';
import { IChatRepository } from '../../chat/infrastructure/db/chat.repository';
import { ChatPostgresRepository } from '../../chat/infrastructure/db/postgres/chatPostgres.repository';
import { IChatMemberRepository } from '../../chat/infrastructure/db/chatmember.repository';
import { ChatMemberPostgresRepository } from '../../chat/infrastructure/db/postgres/chatmember.postgres.repository';
import { IChatRoomMessageRepository } from '../../chat/infrastructure/db/chat-room-message.repository';
import { ChatRoomMessagePostgresRepository } from '../../chat/infrastructure/db/postgres/chat-room-message.repository';

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
    {
      provide: IBlockRepository,
      useClass: BlockPostgresRepository,
    },
    { provide: IChatMemberRepository, useClass: ChatMemberPostgresRepository },
    {
      provide: IChatRoomMessageRepository,
      useClass: ChatRoomMessagePostgresRepository,
    },
  ],
  exports: [
    IUserRepository,
    ILocalFileRepository,
    IAuthProviderRepository,
    IBlockRepository,
    IChatRepository,
    IChatMemberRepository,
    IChatRoomMessageRepository,
  ],
})
export class DbModule {}
