import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../../../shared/db/models';
import { makeQuery } from '../../../../../../shared/db/postgres/utils';
import { PostgresPool } from '../../../../../../shared/db/postgres/postgresConnection.provider';
import { IChatroomMemberRepository } from '../chatroom-member.repository';
import { ChatroomMemberEntity } from '../chatroom-member.entity';
import { ChatroomMemberWithUser } from '../../../chatroom-member.domain';
import { ChatroomMemberWithUserEntity } from '../chatroom-member.entity';

@Injectable()
export class ChatroomMemberPostgresRepository
  extends BasePostgresRepository<ChatroomMemberEntity>
  implements IChatroomMemberRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.CHATROOM_MEMBERS);
  }

  async retrieveChatroomMembers(
    chatroomId: string,
  ): Promise<ChatroomMemberWithUser[] | null> {
    const users = await makeQuery<ChatroomMemberWithUserEntity>(this.pool, {
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
