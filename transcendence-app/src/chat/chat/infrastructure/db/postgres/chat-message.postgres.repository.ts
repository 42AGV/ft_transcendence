import { Injectable } from '@nestjs/common';

import { table } from '../../../../../shared/db/models';
import { PostgresPool } from '../../../../../shared/db/postgres/postgresConnection.provider';
import { BasePostgresRepository } from '../../../../../shared/db/postgres/postgres.repository';
import { ChatMessageEntity } from '../chat-message.entity';
import { IChatMessageRepository } from '../chat-message.repository';
import { ChatMessagePaginationQueryDto } from '../../../../dto/chat-message.pagination.dto';
import { ChatMessageQueryDto } from '../../../../dto/chat-message.dto';
import { makeQuery } from '../../../../../shared/db/postgres/utils';

@Injectable()
export class ChatMessagePostgresRepository
  extends BasePostgresRepository<ChatMessageEntity>
  implements IChatMessageRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.CHAT_MESSAGE);
  }

  async addMessageSet(
    queryDto: Required<ChatMessageQueryDto>,
  ): Promise<ChatMessageEntity | null> {
    const { authorId, content, user1Id, user2Id } = queryDto;

    const message = await makeQuery<ChatMessageEntity>(this.pool, {
      text: `INSERT INTO ${this.table}("authorId", "content", "user1Id", "user2Id")
      VALUES ($1, $2, LEAST($3, $4), GREATEST($3, $4))
      RETURNING *;`,
      values: [authorId, content, user1Id, user2Id],
    });

    return message && message.length ? message[0] : null;
  }

  async getPaginatedMessages(
    queryDto: Required<ChatMessagePaginationQueryDto>,
  ): Promise<ChatMessageEntity[] | null> {
    const { limit, offset, user1Id, user2Id } = queryDto;

    return makeQuery<ChatMessageEntity>(this.pool, {
      text: `SELECT "authorId" "content" "createdAt"
      FROM ${this.table}
      WHERE "user1Id" = LEAST($3, $4)::uuid
        AND  "user2Id" = GREATEST($3, $4)::uuid
      LIMIT $1
      OFFSET $2;`,
      values: [limit, offset, user1Id, user2Id],
    });
  }
}
