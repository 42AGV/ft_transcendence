import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../shared/db/models';
import { PostgresPool } from '../../../../shared/db/postgres/postgresConnection.provider';
import { IChatMemberRepository } from '../chatmember.repository';
import {
  ChatMemberEntity,
  ChatMemberWithUserEntity,
} from '../chatmember.entity';
import { makeQuery } from '../../../../shared/db/postgres/utils';
import { ChatMemberWithUser } from '../../../chatmember.domain';

@Injectable()
export class ChatMemberPostgresRepository
  extends BasePostgresRepository<ChatMemberEntity>
  implements IChatMemberRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.CHATMEMBERS);
  }

  async retrieveChatRoomMembers(
    chatRoomId: string,
  ): Promise<ChatMemberWithUser[] | null> {
    const users = await makeQuery<ChatMemberWithUserEntity>(this.pool, {
      text: `SELECT u."username",
                    u."avatarId",
                    u."avatarX",
                    u."avatarY",
                    c."ownerId" IS NOT NULL as owner,
                    cm."admin",
                    cm."muted",
                    cm."banned"
             FROM ${table.USERS} u
                    INNER JOIN ${this.table} cm
                               ON cm."userId" = u."id"
                    LEFT JOIN ${table.CHATS} c
                              ON c."id" = cm."chatId"
                                AND u."id" = c."ownerId"
             WHERE cm."chatId" = $1
               AND cm."joinedAt" IS NOT NULL`,
      values: [chatRoomId],
    });
    return users && users.length
      ? users.map((user) => new ChatMemberWithUser(user))
      : null;
  }
}
