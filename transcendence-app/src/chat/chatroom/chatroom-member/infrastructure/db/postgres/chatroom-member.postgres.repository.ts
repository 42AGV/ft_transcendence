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
} from '../chatroom-member.entity';

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

    const chatroomMembersData = await makeQuery<ChatroomMember>(this.pool, {
      text: `INSERT INTO ${this.table} (${cols.join(
        ',',
      )}) values (${params.join(',')})
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
    const members = await makeQuery<ChatroomMember>(this.pool, {
      text: `SELECT *
      FROM ${this.table}
      WHERE ${ChatroomMemberKeys.CHATID} = $1
        AND ${ChatroomMemberKeys.USERID} = $2
        AND ${ChatroomMemberKeys.JOINED_AT} IS NOT NULL`,
      values: [chatroomId, userId],
    });
    return members && members.length ? new ChatroomMember(members[0]) : null;
  }

  async updateById(
    chatroomId: string,
    userId: string,
    chatroomMember: Partial<ChatroomMember>,
  ): Promise<ChatroomMember | null> {
    const { cols, values } = entityQueryMapper(chatroomMember);
    const colsToUpdate = cols.map((col, i) => `${col}=$${i + 3}`).join(',');

    const chatroomMembersData = await makeQuery(this.pool, {
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
    const chatroomMembersData = await makeQuery(this.pool, {
      text: `DELETE FROM ${this.table}
      WHERE ${ChatroomMemberKeys.CHATID} = $1
        AND ${ChatroomMemberKeys.USERID} = $2
      RETURNING *;`,
      values: [chatroomId, userId],
    });
    return chatroomMembersData && chatroomMembersData.length
      ? new this.ctor(chatroomMembersData[0])
      : null;
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
    return users ? users.map((user) => new ChatroomMemberWithUser(user)) : null;
  }
}
