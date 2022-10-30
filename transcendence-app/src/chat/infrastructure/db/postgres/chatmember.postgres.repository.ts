import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../shared/db/models';
import { PostgresPool } from '../../../../shared/db/postgres/postgresConnection.provider';
import { IChatMemberRepository } from '../chatmember.repository';
import { ChatMemberEntity, chatMembersKeys } from '../chatmember.entity';
import { makeQuery } from '../../../../shared/db/postgres/utils';

@Injectable()
export class ChatMemberPostgresRepository
  extends BasePostgresRepository<ChatMemberEntity>
  implements IChatMemberRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.CHATMEMBERS);
  }

  async getById(
    chatId: string,
    userId: string,
  ): Promise<ChatMemberEntity | null> {
    const members = await makeQuery<ChatMemberEntity>(this.pool, {
      text: `SELECT *
      FROM ${this.table}
      WHERE ${chatMembersKeys.CHATID} = $1 AND ${chatMembersKeys.USERID} = $2 AND ${chatMembersKeys.JOINED_AT} IS NOT NULL`,
      values: [chatId, userId],
    });
    return members ? members[0] : null;
  }
}
