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
    paginationQueryDto: Required<PaginationQueryDto>,
  ): Promise<GenericChat[] | null> {
    const messages = await makeQuery<GenericChat>(this.pool, {
      text: `
        WITH msg as (SELECT array [least(m."senderId", m."recipientId"),
                              greatest(m."senderId", m."recipientId")] as data,
                            m.id,
                            m."createdAt"
                     FROM ${this.table} m
                     WHERE (m."senderId" = $1
                       OR m."recipientId" = $1)),
             dateProvider as (select msg.data, max(msg."createdAt") as "lastDate" from msg group by msg.data),
             msgIds as (SELECT max(m."id"::text)::uuid as "messId"
                        from dateProvider dp
                               INNER JOIN msg m on m."createdAt" = dp."lastDate"
                        group by m."createdAt"),
             msgData as (SELECT CASE WHEN (cm."senderId" = $1) THEN cm."recipientId" ELSE cm."senderId" END as "id",
                                cm.content,
                                cm."createdAt"
                         FROM ${this.table} cm
                                INNER JOIN msgIds mi ON cm.id = mi."messId"
                         ORDER BY cm."createdAt")
        SELECT u."avatarId",
               u."avatarX",
               u."avatarY",
               'chat/' || u."username"   as "url",
               u."username"              as "name",
               md."content"::varchar(20) as "lastMessage",
               md."createdAt"            as "lastMessageDate"
        FROM ${table.USERS} u
               INNER JOIN msgData md on u."id" = md."id";`,
      values: [userMeId],
    });
    if (messages === null || messages.length === 0) return null;
    return messages.map((message) => new GenericChat(message));
  }
}
