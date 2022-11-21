import { Injectable } from '@nestjs/common';

import { table } from '../../../../../shared/db/models';
import { PostgresPool } from '../../../../../shared/db/postgres/postgresConnection.provider';
import { BasePostgresRepository } from '../../../../../shared/db/postgres/postgres.repository';
import { ChatMessage, chatMessageKeys } from '../chat-message.entity';
import { IChatMessageRepository } from '../chat-message.repository';
import { makeQuery } from '../../../../../shared/db/postgres/utils';
import { PaginationQueryDto } from '../../../../../shared/dtos/pagination.query.dto';

@Injectable()
export class ChatMessagePostgresRepository
  extends BasePostgresRepository<ChatMessage>
  implements IChatMessageRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.CHAT_MESSAGE, ChatMessage);
  }
  async getPaginatedMessages(
    userMeId: string,
    recipientId: string,
    paginationQueryDto: Required<PaginationQueryDto>,
  ): Promise<ChatMessage[] | null> {
    const { limit, offset } = paginationQueryDto;

    const messages = await makeQuery<ChatMessage>(this.pool, {
      text: `SELECT * FROM ${this.table}
      WHERE ("senderId" = $1 AND "recipientId" = $2)
        OR  ("senderId" = $2 AND "recipientId" = $1)
      ORDER BY ${chatMessageKeys.SUCCESSION} DESC
      LIMIT $3
      OFFSET $4;`,
      values: [userMeId, recipientId, limit, offset],
    });
    return messages?.map((message) => new ChatMessage(message)) ?? null;
  }
}
