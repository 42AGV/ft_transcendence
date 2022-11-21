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
import { ChatroomMemberKeys } from '../../../chatroom-member/infrastructure/db/chatroom-member.entity';

@Injectable()
export class ChatroomPostgresRepository
  extends BasePostgresRepository<Chatroom>
  implements IChatroomRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.CHATROOM, Chatroom);
  }

  async addChatroom(chatroom: Partial<Chatroom>): Promise<Chatroom | null> {
    const chatroomData = await makeTransactionalQuery<Chatroom>(
      this.pool,
      async (client) => {
        const chatroomData = await this.insertWithClient(
          client,
          table.CHATROOM,
          chatroom,
        );
        const chatmember = {
          chatId: chatroom.id,
          userId: chatroom.ownerId,
        };
        await this.insertWithClient(client, table.CHATROOM_MEMBERS, chatmember);
        return chatroomData.rows[0];
      },
    );
    return chatroomData ? new this.ctor(chatroomData) : null;
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

  async addAvatarAndAddChatroom(
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
        const chatRes = await this.insertWithClient(client, table.CHATROOM, {
          ...chatroom,
          avatarId,
        });
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
