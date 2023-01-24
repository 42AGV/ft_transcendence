import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../../shared/db/models';
import { PostgresPool } from '../../../../../shared/db/postgres/postgresConnection.provider';
import {
  makeQuery,
  makeTransactionalQuery,
} from '../../../../../shared/db/postgres/utils';
import { BooleanString } from '../../../../../shared/enums/boolean-string.enum';
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
  ): Promise<Chatroom[] | null> {
    const { limit, offset, sort, search } = paginationDto;
    const orderBy =
      sort === BooleanString.True ? ChatroomKeys.NAME : ChatroomKeys.ID;
    const chatroomsData = await makeQuery<Chatroom>(this.pool, {
      text: `SELECT *
             FROM ${this.table}
             WHERE ${ChatroomKeys.NAME} ILIKE $1
             ORDER BY ${orderBy}
             LIMIT $2 OFFSET $3;`,
      values: [`%${search}%`, limit, offset],
    });
    return chatroomsData
      ? chatroomsData.map((chatroom) => new this.ctor(chatroom))
      : null;
  }

  async getAuthUserPaginatedChatrooms(
    authUserId: string,
    queryDto: Required<PaginationWithSearchQueryDto>,
  ): Promise<Chatroom[] | null> {
    const { limit, offset, sort, search } = queryDto;
    const orderBy =
      sort === BooleanString.True
        ? ChatroomMemberKeys.JOINED_AT
        : ChatroomKeys.NAME;
    const chatroomsData = await makeQuery<Chatroom>(this.pool, {
      text: `SELECT c.*
             FROM ${this.table} c
                    INNER JOIN ${table.CHATROOM_MEMBERS} cm
                               ON cm.${ChatroomMemberKeys.USERID} = $4
                                 AND cm.${ChatroomMemberKeys.CHATID} = c.${ChatroomKeys.ID}
             WHERE cm.${ChatroomMemberKeys.JOINED_AT} IS NOT NULL
               AND c.${ChatroomKeys.NAME} ILIKE $1
             ORDER BY ${orderBy}
             LIMIT $2 OFFSET $3;`,
      values: [`%${search}%`, limit, offset, authUserId],
    });
    return chatroomsData
      ? chatroomsData.map((chatroom) => new this.ctor(chatroom))
      : null;
  }

  async getAuthUserPaginatedChatroomsWithLastMessage(
    authUserId: string,
    queryDto?: Required<PaginationWithSearchQueryDto>,
  ): Promise<GenericChat[] | null> {
    const messages = await makeQuery<GenericChatData>(this.pool, {
      text: `WITH lchatrooms as
                    (SELECT c.*
                     FROM ${this.table} c
                            INNER JOIN ${table.CHATROOM_MEMBERS} cm
                                       ON cm."userId" = $1
                                         AND cm."chatId" = c."id"
                     WHERE cm."joinedAt" IS NOT NULL),
                  crMsg AS (SELECT m."chatroomId",
                                   m."userId",
                                   m."id",
                                   m."createdAt"
                            FROM ${table.CHATROOM_MESSAGE} m
                                   INNER JOIN "lchatrooms" cr ON cr."id" = m."chatroomId"),
                  crDateProvider AS (SELECT m."chatroomId",
                                            ROW_NUMBER() OVER (
                                              PARTITION BY m."chatroomId" ORDER BY m."createdAt" DESC
                                              ) AS "rowNumber",
                                            m."id"
                                     FROM crmsg m),
                  crMsgIds AS (SELECT dp."id" AS "msgId"
                               FROM crDateProvider dp
                               WHERE dp."rowNumber" = 1),
                  crMsgData AS (SELECT cm."chatroomId",
                                       u."username" AS "lastMsgSenderUsername",
                                       cm."content",
                                       cm."createdAt"
                                FROM ${table.CHATROOM_MESSAGE} cm
                                       INNER JOIN crmsgIds mi ON cm."id" = mi."msgId"
                                       LEFT JOIN ${table.USERS} u ON cm."userId" = u."id"
                                ORDER BY cm."createdAt")
             SELECT cr."avatarId",
                    cr."avatarX",
                    cr."avatarY",
                    'chatroom/' || cr."id"    AS "url",
                    cr."name",
                    crmd."lastMsgSenderUsername",
                    crmd.content::varchar(20) AS "lastMessage",
                    crmd."createdAt"          AS "lastMessageDate"
             FROM crMsgData crmd
                    INNER JOIN ${this.table} cr
                               ON crmd."chatroomId" = cr.id;`,
      values: [authUserId],
    });
    return messages && messages.length
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
