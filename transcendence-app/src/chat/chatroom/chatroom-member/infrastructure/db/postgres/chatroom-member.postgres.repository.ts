import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../../../shared/db/models';
import { makeQuery } from '../../../../../../shared/db/postgres/utils';
import { PostgresPool } from '../../../../../../shared/db/postgres/postgresConnection.provider';
import { IChatroomMemberRepository } from '../chatroom-member.repository';
import {
  ChatroomMember,
  ChatroomMemberWithUser,
  ChatroomMemberKeys,
} from '../chatroom-member.entity';

@Injectable()
export class ChatroomMemberPostgresRepository
  extends BasePostgresRepository<ChatroomMember>
  implements IChatroomMemberRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.CHATROOM_MEMBERS, ChatroomMember);
  }

  async getById(
    chatId: string,
    userId: string,
  ): Promise<ChatroomMember | null> {
    const members = await makeQuery<ChatroomMember>(this.pool, {
      text: `SELECT *
      FROM ${this.table}
      WHERE ${ChatroomMemberKeys.CHATID} = $1
        AND ${ChatroomMemberKeys.USERID} = $2
        AND ${ChatroomMemberKeys.JOINED_AT} IS NOT NULL`,
      values: [chatId, userId],
    });
    return members ? members[0] : null;
  }

  async retrieveChatroomMembers(
    chatroomId: string,
  ): Promise<ChatroomMemberWithUser[] | null> {
    const users = await makeQuery<ChatroomMemberWithUser>(this.pool, {
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
                    LEFT JOIN ${table.CHATROOM} c
                              ON c."id" = cm."chatId"
                                AND u."id" = c."ownerId"
             WHERE cm."chatId" = $1
               AND cm."joinedAt" IS NOT NULL`,
      values: [chatroomId],
    });
    return users && users.length
      ? users.map((user) => new ChatroomMemberWithUser(user))
      : null;
  }
}
