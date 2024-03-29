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
import { IChatroomRepository } from '../../chat/chatroom/infrastructure/db/chatroom.repository';
import { ChatroomPostgresRepository } from '../../chat/chatroom/infrastructure/db/postgres/chatroom.postgres.repository';
import { IChatroomMemberRepository } from '../../chat/chatroom/chatroom-member/infrastructure/db/chatroom-member.repository';
import { ChatroomMemberPostgresRepository } from '../../chat/chatroom/chatroom-member/infrastructure/db/postgres/chatroom-member.postgres.repository';
import { IChatroomMessageRepository } from '../../chat/chatroom/chatroom-message/infrastructure/db/chatroom-message.repository';
import { ChatroomMessagePostgresRepository } from '../../chat/chatroom/chatroom-message/infrastructure/db/postgres/chatroom-message.repository';
import { IChatMessageRepository } from '../../chat/chat/infrastructure/db/chat-message.repository';
import { ChatMessagePostgresRepository } from '../../chat/chat/infrastructure/db/postgres/chat-message.postgres.repository';
import { IFriendRepository } from '../../user/infrastructure/db/friend.repository';
import { FriendPostgresRepository } from '../../user/infrastructure/db/postgres/friend.postgres.repository';
import { IUserToRoleRepository } from '../../authorization/infrastructure/db/user-to-role.repository';
import { UserToRolePostgresRepository } from '../../authorization/infrastructure/db/postgres/user-to-role.postgres.repository';
import { IGameRepository } from '../../game/infrastructure/db/game.repository';
import { GamePostgresRepository } from '../../game/infrastructure/db/postgres/game.postgres.repository';
import { IUserLevelRepository } from '../../game/stats/infrastructure/db/user-level.repository';
import { UserLevelPostgresRepository } from '../../game/stats/infrastructure/db/postgres/user-level.postgres.repository';

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
    {
      provide: IChatroomMessageRepository,
      useClass: ChatroomMessagePostgresRepository,
    },
    {
      provide: IChatMessageRepository,
      useClass: ChatMessagePostgresRepository,
    },
    {
      provide: IFriendRepository,
      useClass: FriendPostgresRepository,
    },
    {
      provide: IUserToRoleRepository,
      useClass: UserToRolePostgresRepository,
    },
    {
      provide: IGameRepository,
      useClass: GamePostgresRepository,
    },
    {
      provide: IUserLevelRepository,
      useClass: UserLevelPostgresRepository,
    },
  ],
  exports: [
    IUserRepository,
    ILocalFileRepository,
    IAuthProviderRepository,
    IBlockRepository,
    IChatroomRepository,
    IChatroomMemberRepository,
    IChatroomMessageRepository,
    IChatMessageRepository,
    IFriendRepository,
    IUserToRoleRepository,
    IGameRepository,
    IUserLevelRepository,
  ],
})
export class DbModule {}
