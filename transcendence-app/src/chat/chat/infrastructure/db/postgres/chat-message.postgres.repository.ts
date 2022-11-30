import { Injectable } from '@nestjs/common';

import { table } from '../../../../../shared/db/models';
import { PostgresPool } from '../../../../../shared/db/postgres/postgresConnection.provider';
import { BasePostgresRepository } from '../../../../../shared/db/postgres/postgres.repository';
import { ChatMessage, chatMessageKeys } from '../chat-message.entity';
import { IChatMessageRepository } from '../chat-message.repository';
import { makeQuery } from '../../../../../shared/db/postgres/utils';
import { PaginationQueryDto } from '../../../../../shared/dtos/pagination.query.dto';
import { userKeys } from '../../../../../user/infrastructure/db/user.entity';
import { ChatMessageWithUser } from '../chat-message-with-user.entity';

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
  ): Promise<ChatMessageWithUser[] | null> {
    const { limit, offset } = paginationQueryDto;

    const messages = await makeQuery<ChatMessageWithUser>(this.pool, {
      text: `SELECT m.*,
        u.${userKeys.USERNAME},
        u.${userKeys.AVATAR_ID},
        u.${userKeys.AVATAR_X},
        u.${userKeys.AVATAR_Y}
      FROM ${this.table} m
      INNER JOIN ${table.USERS} u
        ON (m.${chatMessageKeys.SENDER_ID} =
            u.${userKeys.ID})
      WHERE (m."senderId" = $1 AND m."recipientId" = $2)
        OR  (m."senderId" = $2 AND m."recipientId" = $1)
      ORDER BY m.${chatMessageKeys.CREATED_AT} DESC, m.${chatMessageKeys.ID}
      LIMIT $3
      OFFSET $4;`,
      values: [userMeId, recipientId, limit, offset],
    });
    return messages?.map((message) => new ChatMessageWithUser(message)) ?? null;
  }
}
