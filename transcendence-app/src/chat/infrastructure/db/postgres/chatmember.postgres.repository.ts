import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../shared/db/models';
import { PostgresPool } from '../../../../shared/db/postgres/postgresConnection.provider';
import { IChatMemberRepository } from '../chatmember.repository';
import {
  ChatMember,
  chatMembersKeys,
  ChatMemberWithUser,
} from '../chatmember.entity';
import { makeQuery } from '../../../../shared/db/postgres/utils';

@Injectable()
export class ChatMemberPostgresRepository
  extends BasePostgresRepository<ChatMember>
  implements IChatMemberRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.CHATMEMBERS, ChatMember);
  }

  async getById(chatId: string, userId: string): Promise<ChatMember | null> {
    const membersData = await makeQuery<ChatMember>(this.pool, {
      text: `SELECT *
      FROM ${this.table}
      WHERE ${chatMembersKeys.CHATID} = $1
        AND ${chatMembersKeys.USERID} = $2
        AND ${chatMembersKeys.JOINED_AT} IS NOT NULL`,
      values: [chatId, userId],
    });
    return membersData ? new this.ctor(membersData[0]) : null;
  }

  async retrieveChatRoomMembers(
    chatRoomId: string,
  ): Promise<ChatMemberWithUser[] | null> {
    const usersData = await makeQuery<ChatMemberWithUser>(this.pool, {
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
    return usersData && usersData.length
      ? usersData.map((data) => new ChatMemberWithUser(data))
      : null;
  }
}
