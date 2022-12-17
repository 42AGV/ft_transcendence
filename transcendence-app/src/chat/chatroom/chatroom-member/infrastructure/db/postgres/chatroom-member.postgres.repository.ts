import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../../../shared/db/models';
import {
  entityQueryMapper,
  makeQuery,
} from '../../../../../../shared/db/postgres/utils';
import { PostgresPool } from '../../../../../../shared/db/postgres/postgresConnection.provider';
import { IChatroomMemberRepository } from '../chatroom-member.repository';
import {
  ChatroomMember,
  ChatroomMemberWithUser,
  ChatroomMemberKeys,
  ChatroomMemberWithUserData,
  ChatroomMemberData,
} from '../chatroom-member.entity';
import { userKeys } from '../../../../../../user/infrastructure/db/user.entity';
import { ChatroomKeys } from '../../../../infrastructure/db/chatroom.entity';
import { PaginationWithSearchQueryDto } from '../../../../../../shared/dtos/pagination-with-search.query.dto';
import { BooleanString } from '../../../../../../shared/enums/boolean-string.enum';

@Injectable()
export class ChatroomMemberPostgresRepository
  extends BasePostgresRepository<ChatroomMember>
  implements IChatroomMemberRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.CHATROOM_MEMBERS, ChatroomMember);
  }

  async addChatroomMember(
    chatroomMember: ChatroomMember,
  ): Promise<ChatroomMember | null> {
    const { cols, params, values } = entityQueryMapper(chatroomMember);
    const joinedAtColName = ChatroomMemberKeys.JOINED_AT;

    const chatroomMembersData = await makeQuery<ChatroomMemberData>(this.pool, {
      text: `INSERT INTO ${this.table} (${cols.join(',')})
             values (${params.join(',')})
             ON CONFLICT
               (${ChatroomMemberKeys.CHATID}, ${ChatroomMemberKeys.USERID})
               DO UPDATE
               SET ${joinedAtColName} = EXCLUDED.${joinedAtColName}
             RETURNING *;`,
      values,
    });
    return chatroomMembersData && chatroomMembersData.length
      ? new this.ctor(chatroomMembersData[0])
      : null;
  }

  async getById(
    chatroomId: string,
    userId: string,
  ): Promise<ChatroomMember | null> {
    const members = await makeQuery<ChatroomMemberData>(this.pool, {
      text: `SELECT cm.*, c.${ChatroomKeys.OWNERID} = $2 AS owner
             FROM ${this.table} cm
                    LEFT JOIN ${table.CHATROOM} c on c.${ChatroomKeys.ID} = cm.${ChatroomMemberKeys.CHATID}
             WHERE ${ChatroomMemberKeys.CHATID} = $1
               AND ${ChatroomMemberKeys.USERID} = $2
               AND ${ChatroomMemberKeys.JOINED_AT} IS NOT NULL`,
      values: [chatroomId, userId],
    });
    return members && members.length ? new ChatroomMember(members[0]) : null;
  }

  /*
  SELECT cm.*, c."ownerId" = '35f3973e-9d6a-4593-8303-57d7a2ef42e2' as owner
FROM chatroommembers cm
LEFT JOIN chatroom c on c."id" = cm."chatId"
WHERE "chatId" = '8fb2faa3-b183-448e-8106-92728a641fcb'
  AND "userId" = '35f3973e-9d6a-4593-8303-57d7a2ef42e2'
  AND "joinedAt" IS NOT NULL;
  * */

  async getByIdWithUser(
    chatroomId: string,
    userId: string,
  ): Promise<ChatroomMemberWithUser | null> {
    const members = await makeQuery<ChatroomMemberWithUserData>(this.pool, {
      text: `SELECT u.${userKeys.USERNAME},
                    u.${userKeys.AVATAR_ID},
                    u.${userKeys.AVATAR_X},
                    u.${userKeys.AVATAR_Y},
                    c.${ChatroomKeys.OWNERID} IS NOT NULL AS owner,
                    cm.${ChatroomMemberKeys.ADMIN},
                    cm.${ChatroomMemberKeys.MUTED},
                    cm.${ChatroomMemberKeys.BANNED}
             FROM ${table.USERS} u
                    INNER JOIN ${this.table} cm ON cm.${ChatroomMemberKeys.USERID} = u.${userKeys.ID}
                    LEFT JOIN ${table.CHATROOM} c ON c.${ChatroomKeys.ID} = cm.${ChatroomMemberKeys.CHATID}
               AND u.${userKeys.ID} = c.${ChatroomKeys.OWNERID}
             WHERE cm.${ChatroomMemberKeys.CHATID} = $1
               AND cm.${ChatroomMemberKeys.USERID} = $2
               AND cm.${ChatroomMemberKeys.JOINED_AT} IS NOT NULL;`,
      values: [chatroomId, userId],
    });
    return members && members.length
      ? new ChatroomMemberWithUser(members[0])
      : null;
  }

  async updateById(
    chatroomId: string,
    userId: string,
    chatroomMember: Partial<ChatroomMember>,
  ): Promise<ChatroomMember | null> {
    const { cols, values } = entityQueryMapper(chatroomMember);
    const colsToUpdate = cols.map((col, i) => `${col}=$${i + 3}`).join(',');

    const chatroomMembersData = await makeQuery<ChatroomMemberData>(this.pool, {
      text: `UPDATE ${this.table}
             SET ${colsToUpdate}
             WHERE ${ChatroomMemberKeys.CHATID} = $1
               AND ${ChatroomMemberKeys.USERID} = $2
             RETURNING *;`,
      values: [chatroomId, userId, ...values],
    });
    return chatroomMembersData && chatroomMembersData.length
      ? new this.ctor(chatroomMembersData[0])
      : null;
  }

  async deleteById(
    chatroomId: string,
    userId: string,
  ): Promise<ChatroomMember | null> {
    const chatroomMembersData = await makeQuery<ChatroomMemberData>(this.pool, {
      text: `DELETE
             FROM ${this.table}
             WHERE ${ChatroomMemberKeys.CHATID} = $1
               AND ${ChatroomMemberKeys.USERID} = $2
             RETURNING *;`,
      values: [chatroomId, userId],
    });
    return chatroomMembersData && chatroomMembersData.length
      ? new this.ctor(chatroomMembersData[0])
      : null;
  }

  async getPaginatedChatroomMembers(
    chatroomId: string,
    paginationQueryDto: Required<PaginationWithSearchQueryDto>,
  ): Promise<ChatroomMemberWithUser[] | null> {
    const { limit, offset, sort, search } = paginationQueryDto;

    const orderBy =
      sort === BooleanString.True
        ? ChatroomMemberKeys.JOINED_AT
        : userKeys.USERNAME;
    const users = await makeQuery<ChatroomMemberWithUser>(this.pool, {
      text: `SELECT u.${userKeys.USERNAME},
                    u.${userKeys.AVATAR_ID},
                    u.${userKeys.AVATAR_X},
                    u.${userKeys.AVATAR_Y},
                    c.${ChatroomKeys.OWNERID} IS NOT NULL as owner,
                    cm.${ChatroomMemberKeys.ADMIN},
                    cm.${ChatroomMemberKeys.MUTED},
                    cm.${ChatroomMemberKeys.BANNED},
                    cm.${ChatroomMemberKeys.USERID}
             FROM ${table.USERS} u
                    INNER JOIN ${this.table} cm
                               ON cm.${ChatroomMemberKeys.USERID} = u.${userKeys.ID}
                    LEFT JOIN ${table.CHATROOM} c
                              ON c.${ChatroomKeys.ID} = cm.${ChatroomMemberKeys.CHATID}
                                AND u.${userKeys.ID} = c.${ChatroomKeys.OWNERID}
             WHERE cm.${ChatroomMemberKeys.CHATID} = $1
               AND cm.${ChatroomMemberKeys.JOINED_AT} IS NOT NULL
               AND ${userKeys.USERNAME} ILIKE $2
             ORDER BY ${orderBy} DESC, u.${userKeys.ID}
             LIMIT $3 OFFSET $4;`,
      values: [chatroomId, `%${search}%`, limit, offset],
    });
    return users ? users.map((user) => new ChatroomMemberWithUser(user)) : null;
  }
}
