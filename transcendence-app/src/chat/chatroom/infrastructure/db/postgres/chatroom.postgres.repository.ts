import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../../shared/db/models';
import { PostgresPool } from '../../../../../shared/db/postgres/postgresConnection.provider';
import {
  makeQuery,
  makeTransactionalQuery,
} from '../../../../../shared/db/postgres/utils';
import { LocalFile } from '../../../../../shared/local-file/infrastructure/db/local-file.entity';
import { Chatroom, ChatroomKeys } from '../chatroom.entity';
import { IChatroomRepository } from '../chatroom.repository';
import { UpdateChatroomDto } from '../../../dto/update-chatroom.dto';
import { PaginationWithSearchQueryDto } from '../../../../../shared/dtos/pagination-with-search.query.dto';
import {
  ChatroomMember,
  ChatroomMemberKeys,
} from '../../../chatroom-member/infrastructure/db/chatroom-member.entity';
import {
  GenericChat,
  GenericChatData,
} from '../../../../infrastructure/generic-chat.entity';
import { chatMessageKeys } from '../../../../chat/infrastructure/db/chat-message.entity';
import { userKeys } from '../../../../../user/infrastructure/db/user.entity';
import { ChatroomMessageKeys } from '../../../chatroom-message/infrastructure/db/chatroom-message.entity';

@Injectable()
export class ChatroomPostgresRepository
  extends BasePostgresRepository<Chatroom>
  implements IChatroomRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.CHATROOM, Chatroom);
  }

  async getById(id: string): Promise<Chatroom | null> {
    const chats = await this.getByKey(ChatroomKeys.ID, id);
    return chats && chats.length ? chats[0] : null;
  }

  async getByChatroomName(chatName: string): Promise<Chatroom | null> {
    const chats = await this.getByKey(ChatroomKeys.NAME, chatName);
    return chats && chats.length ? chats[0] : null;
  }

  async deleteByChatroomName(chatName: string): Promise<Chatroom | null> {
    const chats = await this.deleteByKey(ChatroomKeys.NAME, chatName);
    return chats && chats.length ? chats[0] : null;
  }

  async deleteById(id: string): Promise<Chatroom | null> {
    const chats = await this.deleteByKey(ChatroomKeys.ID, id);
    return chats && chats.length ? chats[0] : null;
  }

  async updateById(
    id: string,
    updateChatroomDto: UpdateChatroomDto,
  ): Promise<Chatroom | null> {
    const chatrooms = await this.updateByKey(
      ChatroomKeys.ID,
      id,
      updateChatroomDto,
    );
    return chatrooms && chatrooms.length ? chatrooms[0] : null;
  }

  async getPaginatedChatrooms(
    paginationDto: Required<PaginationWithSearchQueryDto>,
  ): Promise<GenericChat[] | null> {
    const { limit, offset, search } = paginationDto;
    const chatroomsData = await makeQuery<GenericChatData>(this.pool, {
      text: `WITH crMsg AS (SELECT m.${ChatroomMessageKeys.CHATROOM_ID},
                                   m.${ChatroomMessageKeys.USER_ID},
                                   m.${ChatroomMessageKeys.ID},
                                   m.${ChatroomMessageKeys.CREATED_AT}
                            FROM ${table.CHATROOM_MESSAGE} m),
                  crDateProvider AS (SELECT m.${ChatroomMessageKeys.CHATROOM_ID},
                                            ROW_NUMBER() OVER (
                                              PARTITION BY m.${ChatroomMessageKeys.CHATROOM_ID} ORDER BY m.${ChatroomMessageKeys.CREATED_AT} DESC
                                              ) AS "rowNumber",
                                            m.${ChatroomMessageKeys.ID}
                                     FROM crMsg m),
                  crMsgIds AS (SELECT dp.${ChatroomMessageKeys.ID} AS "msgId"
                               FROM crDateProvider dp
                               WHERE dp."rowNumber" = 1),
                  crMsgData AS (SELECT cm.${ChatroomMessageKeys.CHATROOM_ID},
                                       u.${userKeys.USERNAME} AS "lastMsgSenderUsername",
                                       cm.${ChatroomMessageKeys.CONTENT},
                                       cm.${ChatroomMessageKeys.CREATED_AT}
                                FROM ${table.CHATROOM_MESSAGE} cm
                                       INNER JOIN crMsgIds mi ON cm.${ChatroomMessageKeys.ID} = mi."msgId"
                                       LEFT JOIN ${table.USERS} u ON cm.${ChatroomMessageKeys.USER_ID} = u.${userKeys.ID}
                                ORDER BY cm.${ChatroomMessageKeys.CREATED_AT})
             SELECT cr.${ChatroomKeys.AVATAR_ID},
                    cr.${ChatroomKeys.AVATAR_X},
                    cr.${ChatroomKeys.AVATAR_Y},
                    '/chatroom/' || cr.${ChatroomKeys.ID}            AS "url",
                    cr.${ChatroomKeys.NAME},
                    crmd."lastMsgSenderUsername",
                    crmd.${ChatroomMessageKeys.CONTENT}::varchar(20) AS "lastMessage",
                    crmd.${ChatroomMessageKeys.CREATED_AT}           AS "lastMessageDate"
             FROM crMsgData crmd
                    INNER JOIN ${this.table} cr
                               ON crmd.${ChatroomMessageKeys.CHATROOM_ID} = cr.${ChatroomKeys.ID}
             WHERE cr.${ChatroomKeys.NAME} ILIKE $1
             ORDER BY "lastMessageDate" DESC
             LIMIT $2 OFFSET $3;`,
      values: [`%${search}%`, limit, offset],
    });
    return chatroomsData
      ? chatroomsData.map((chatroom) => new GenericChat(chatroom))
      : null;
  }

  async getAuthUserPaginatedChatsAndChatrooms(
    authUserId: string,
    queryDto: Required<PaginationWithSearchQueryDto>,
  ): Promise<GenericChat[] | null> {
    const { limit, offset, search } = queryDto;
    const messages = await makeQuery<GenericChatData>(this.pool, {
      text: `
        WITH msg as (SELECT ARRAY [least(m.${chatMessageKeys.SENDER_ID}, m.${chatMessageKeys.RECIPIENT_ID}),
                              greatest(m.${chatMessageKeys.SENDER_ID}, m.${chatMessageKeys.RECIPIENT_ID})] AS "partakers",
                            m.${chatMessageKeys.ID},
                            m.${chatMessageKeys.CREATED_AT}
                     FROM ${table.CHAT_MESSAGE} m
                     WHERE (m.${chatMessageKeys.SENDER_ID} = $1
                       OR m.${chatMessageKeys.RECIPIENT_ID} = $1)),
             dateProvider AS (SELECT msg."partakers",
                                     ROW_NUMBER() OVER (
                                       PARTITION BY msg."partakers"
                                       ORDER BY msg.${chatMessageKeys.CREATED_AT} DESC
                                       ) AS "rowNumber",
                                     msg.${chatMessageKeys.ID}
                              FROM msg),
             msgIds AS (SELECT dp.${chatMessageKeys.ID} AS "msgId"
                        FROM dateProvider dp
                        WHERE dp."rowNumber" = 1),
             msgData
               AS (SELECT CASE WHEN (cm.${chatMessageKeys.SENDER_ID} = $1) THEN cm.${chatMessageKeys.RECIPIENT_ID} ELSE cm.${chatMessageKeys.SENDER_ID} END AS "userId",
                          u.${userKeys.USERNAME}                                                                                                            AS "lastMsgSenderUsername",
                          cm.${chatMessageKeys.CONTENT},
                          cm.${chatMessageKeys.CREATED_AT}
                   FROM ${table.CHAT_MESSAGE} cm
                          INNER JOIN msgIds mi ON cm.${chatMessageKeys.ID} = mi."msgId"
                          LEFT JOIN ${table.USERS} u ON cm.${chatMessageKeys.SENDER_ID} = u.${userKeys.ID}
                   ORDER BY cm.${chatMessageKeys.CREATED_AT}),
             lChatMessages as (SELECT u.${userKeys.AVATAR_ID},
                                      u.${userKeys.AVATAR_X},
                                      u.${userKeys.AVATAR_Y},
                                      '/chat/' || u.${userKeys.USERNAME}         AS "url",
                                      u.${userKeys.USERNAME}                     AS "name",
                                      u.${userKeys.ID}                           AS "id",
                                      md."lastMsgSenderUsername",
                                      md.${chatMessageKeys.CONTENT}::varchar(20) AS "lastMessage",
                                      md.${chatMessageKeys.CREATED_AT}           AS "lastMessageDate"
                               FROM ${table.USERS} u
                                      INNER JOIN msgData md ON u.${userKeys.ID} = md."userId"
                               ORDER BY md.${chatMessageKeys.CREATED_AT}),
             lchatrooms AS
               (SELECT c.*
                FROM ${this.table} c
                       INNER JOIN ${table.CHATROOM_MEMBERS} cm
                                  ON cm.${ChatroomMemberKeys.USERID} = $1
                                    AND cm.${ChatroomMemberKeys.CHATID} = c.${ChatroomKeys.ID}
                WHERE cm.${ChatroomMemberKeys.JOINED_AT} IS NOT NULL),
             crMsg AS (SELECT m.${ChatroomMessageKeys.CHATROOM_ID},
                              m.${ChatroomMessageKeys.USER_ID},
                              m.${ChatroomMessageKeys.ID},
                              m.${ChatroomMessageKeys.CREATED_AT}
                       FROM ${table.CHATROOM_MESSAGE} m
                              INNER JOIN "lchatrooms" cr ON cr.${ChatroomKeys.ID} = m.${ChatroomMessageKeys.CHATROOM_ID}),
             crDateProvider AS (SELECT m.${ChatroomMessageKeys.CHATROOM_ID},
                                       ROW_NUMBER() OVER (
                                         PARTITION BY m.${ChatroomMessageKeys.CHATROOM_ID} ORDER BY m.${ChatroomMessageKeys.CREATED_AT} DESC
                                         ) AS "rowNumber",
                                       m.${ChatroomMessageKeys.ID}
                                FROM crMsg m),
             crMsgIds AS (SELECT dp.${ChatroomMessageKeys.ID} AS "msgId"
                          FROM crDateProvider dp
                          WHERE dp."rowNumber" = 1),
             crMsgData AS (SELECT cm.${ChatroomMessageKeys.CHATROOM_ID},
                                  u.${userKeys.USERNAME} AS "lastMsgSenderUsername",
                                  cm.${ChatroomMessageKeys.CONTENT},
                                  cm.${ChatroomMessageKeys.CREATED_AT}
                           FROM ${table.CHATROOM_MESSAGE} cm
                                  INNER JOIN crMsgIds mi ON cm.${ChatroomMessageKeys.ID} = mi."msgId"
                                  LEFT JOIN ${table.USERS} u ON cm.${ChatroomMessageKeys.USER_ID} = u.${userKeys.ID}
                           ORDER BY cm.${ChatroomMessageKeys.CREATED_AT}),
             lChatroomMessages AS (SELECT cr.${ChatroomKeys.AVATAR_ID},
                                          cr.${ChatroomKeys.AVATAR_X},
                                          cr.${ChatroomKeys.AVATAR_Y},
                                          '/chatroom/' || cr.${ChatroomKeys.ID}            AS "url",
                                          cr.${ChatroomKeys.NAME},
                                          cr.${ChatroomKeys.ID}                            AS "id",
                                          crmd."lastMsgSenderUsername",
                                          crmd.${ChatroomMessageKeys.CONTENT}::varchar(20) AS "lastMessage",
                                          crmd.${ChatroomMessageKeys.CREATED_AT}           AS "lastMessageDate"
                                   FROM crMsgData crmd
                                          INNER JOIN ${this.table} cr
                                                     ON crmd.${ChatroomMessageKeys.CHATROOM_ID} = cr.${ChatroomKeys.ID}),
             merged AS ((SELECT * FROM lChatMessages) UNION (SELECT * FROM lChatroomMessages))
        SELECT *
        from merged m
        WHERE m.${ChatroomKeys.NAME} ILIKE $2
        ORDER BY m."lastMessageDate" DESC
        LIMIT $3 OFFSET $4;`,
      values: [authUserId, `%${search}%`, limit, offset],
    });
    return messages
      ? messages.map((message) => new GenericChat(message))
      : null;
  }

  async addAvatarAndAddChatroom(
    avatar: LocalFile,
    chatroom: Omit<Chatroom, 'isPublic'>,
  ): Promise<Chatroom | null> {
    const chatroomData = await makeTransactionalQuery<Chatroom>(
      this.pool,
      async (client) => {
        const avatarRes = await this.insertWithClient(
          client,
          table.LOCAL_FILE,
          avatar,
        );
        const avatarId = (avatarRes.rows[0] as LocalFile).id;
        const chatRes = await this.insertWithClient(client, table.CHATROOM, {
          ...chatroom,
          avatarId,
        });
        const owner: Partial<ChatroomMember> = {
          chatId: chatroom.id,
          userId: chatroom.ownerId,
          admin: true,
        };
        await this.insertWithClient(client, table.CHATROOM_MEMBERS, owner);
        return chatRes.rows[0];
      },
    );
    return chatroomData ? new this.ctor(chatroomData) : null;
  }

  async addAvatarAndUpdateChatroom(
    avatar: LocalFile,
    chatroom: Chatroom,
  ): Promise<Chatroom | null> {
    const chatroomData = await makeTransactionalQuery<Chatroom>(
      this.pool,
      async (client) => {
        const avatarRes = await this.insertWithClient(
          client,
          table.LOCAL_FILE,
          avatar,
        );
        const avatarId = (avatarRes.rows[0] as LocalFile).id;
        const chatRes = await this.updateByIdWithClient(
          client,
          this.table,
          chatroom.id,
          {
            avatarId,
          },
        );
        return chatRes.rows[0];
      },
    );
    return chatroomData ? new this.ctor(chatroomData) : null;
  }
}
