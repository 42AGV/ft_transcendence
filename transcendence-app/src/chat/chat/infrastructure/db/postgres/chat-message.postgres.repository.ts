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
import { GenericChat } from '../../../../infrastructure/generic-chat.entity';

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
             WHERE (m.${chatMessageKeys.SENDER_ID} = $1 AND m.${chatMessageKeys.RECIPIENT_ID} = $2)
                OR (m.${chatMessageKeys.SENDER_ID} = $2 AND m.${chatMessageKeys.RECIPIENT_ID} = $1)
             ORDER BY m.${chatMessageKeys.CREATED_AT} DESC, m.${chatMessageKeys.ID}
             LIMIT $3 OFFSET $4;`,
      values: [userMeId, recipientId, limit, offset],
    });
    return messages?.map((message) => new ChatMessageWithUser(message)) ?? null;
  }

  async getAuthUserChats(
    userMeId: string,
    paginationQueryDto?: Required<PaginationQueryDto>,
  ): Promise<GenericChat[] | null> {
    const messages = await makeQuery<GenericChat>(this.pool, {
      text: `
        WITH msg as (SELECT array [least(m.${chatMessageKeys.SENDER_ID}, m.${chatMessageKeys.RECIPIENT_ID}),
                              greatest(m.${chatMessageKeys.SENDER_ID}, m.${chatMessageKeys.RECIPIENT_ID})] as data,
                            m.${chatMessageKeys.ID},
                            m.${chatMessageKeys.CREATED_AT}
                     FROM ${this.table} m
                     WHERE (m.${chatMessageKeys.SENDER_ID} = $1
                       OR m.${chatMessageKeys.RECIPIENT_ID} = $1)),
             dateProvider as (select msg.data, max(msg.${chatMessageKeys.CREATED_AT}) as "lastDate" from msg group by msg.data),
             msgIds as (SELECT max(m.${chatMessageKeys.ID}::text)::uuid as "messId"
                        from dateProvider dp
                               INNER JOIN msg m on m.${chatMessageKeys.CREATED_AT} = dp."lastDate"
                        group by m.${chatMessageKeys.CREATED_AT}),
             msgData as (SELECT CASE WHEN (cm.${chatMessageKeys.SENDER_ID} = $1) THEN cm.${chatMessageKeys.RECIPIENT_ID} ELSE cm.${chatMessageKeys.SENDER_ID} END as "id",
                                cm.${chatMessageKeys.CONTENT},
                                cm.${chatMessageKeys.CREATED_AT}
                         FROM ${this.table} cm
                                INNER JOIN msgIds mi ON cm.${chatMessageKeys.ID} = mi."messId"
                         ORDER BY cm.${chatMessageKeys.CREATED_AT})
        SELECT u.${userKeys.AVATAR_ID},
               u.${userKeys.AVATAR_X},
               u.${userKeys.AVATAR_Y},
               'chat/' || u.${userKeys.USERNAME}   as "url",
               u.${userKeys.USERNAME}              as "name",
               md.${chatMessageKeys.CONTENT}::varchar(20) as "lastMessage",
               md.${chatMessageKeys.CREATED_AT}            as "lastMessageDate"
        FROM ${table.USERS} u
               INNER JOIN msgData md on u.${userKeys.ID} = md.${chatMessageKeys.ID};`,
      values: [userMeId],
    });
    if (messages === null || messages.length === 0) return null;
    return messages.map((message) => new GenericChat(message));
  }
}
