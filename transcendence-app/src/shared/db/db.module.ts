import { Module } from '@nestjs/common';
import { PostgresPool } from './postgres/postgresConnection.provider';
import { IUserRepository } from '../../user/infrastructure/db/user.repository';
import { UserPostgresRepository } from '../../user/infrastructure/db/postgres/user.postgres.repository';
import { ILocalFileRepository } from '../local-file/infrastructure/db/local-file.repository';
import { LocalFilePostgresRepository } from '../local-file/infrastructure/db/postgres/local-file.postgres.repository';
import { AuthProviderPostgresRepository } from '../../auth/auth-provider/infrastructure/db/postgres/auth-provider.postgres.repository';
import { IAuthProviderRepository } from '../../auth/auth-provider/infrastructure/db/auth-provider.repository';
import { IBlockRepository } from '../../user/infrastructure/db/block.repository';
import { BlockPostgresRepository } from '../../user/infrastructure/db/postgres/block.postgres.repository';
import { IChatroomRepository } from '../../chat/chatroom/infrastructure/chatroom.repository';
import { ChatroomPostgresRepository } from '../../chat/chatroom/chatroom-message/infrastructure/postgres/chatroom.postgres.repository';
import { IChatroomMemberRepository } from '../../chat/chatroom/chatroom-member/infrastructure/chatroom-member.repository';
import { ChatroomMemberPostgresRepository } from '../../chat/chatroom/chatroom-member/infrastructure/postgres/chatroom-member.postgres.repository';

@Module({
  providers: [
    PostgresPool,
    { provide: IUserRepository, useClass: UserPostgresRepository },
    { provide: ILocalFileRepository, useClass: LocalFilePostgresRepository },
    { provide: IChatroomRepository, useClass: ChatroomPostgresRepository },
    {
      provide: IAuthProviderRepository,
      useClass: AuthProviderPostgresRepository,
    },
    {
      provide: IBlockRepository,
      useClass: BlockPostgresRepository,
    },
    {
      provide: IChatroomMemberRepository,
      useClass: ChatroomMemberPostgresRepository,
    },
  ],
  exports: [
    IUserRepository,
    ILocalFileRepository,
    IAuthProviderRepository,
    IBlockRepository,
    IChatroomRepository,
    IChatroomMemberRepository,
  ],
})
export class DbModule {}
