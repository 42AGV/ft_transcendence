import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../../shared/db/models';
import { PostgresPool } from '../../../../../shared/db/postgres/postgresConnection.provider';
import {
  entityQueryMapper,
  makeQuery,
} from '../../../../../shared/db/postgres/utils';
import { BooleanString } from '../../../../../shared/enums/boolean-string.enum';
import { LocalFile } from '../../../../../shared/local-file/infrastructure/db/local-file.entity';
import { PoolClient } from 'pg';
import { Chatroom, ChatroomKeys } from '../chatroom.entity';
import { IChatroomRepository } from '../chatroom.repository';
import { UpdateChatroomDto } from '../../../dto/update-chatroom.dto';
import { PaginationWithSearchQueryDto } from '../../../../../shared/dtos/pagination-with-search.query.dto';

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
      LIMIT $2
      OFFSET $3;`,
      values: [`%${search}%`, limit, offset],
    });
    return chatroomsData
      ? chatroomsData.map((chatroom) => new this.ctor(chatroom))
      : null;
  }

  async addAvatarAndAddChatroom(
    avatar: LocalFile,
    chatroom: Chatroom,
  ): Promise<Chatroom | null> {
    const chatroomData = await this.pool.transaction<Chatroom>(
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
    const chatroomData = await this.pool.transaction<Chatroom>(
      async (client) => {
        const avatarRes = await this.insertWithClient(
          client,
          table.LOCAL_FILE,
          avatar,
        );
        const avatarId = (avatarRes.rows[0] as LocalFile).id;
        const chatRes = await this.updateUserByIdWithClient(
          client,
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

  private insertWithClient(
    client: PoolClient,
    table: table,
    entity: Partial<Chatroom> | LocalFile,
  ) {
    const { cols, params, values } = entityQueryMapper(entity);
    const text = `INSERT INTO ${table}(${cols.join(
      ', ',
    )}) VALUES (${params.join(',')}) RETURNING *;`;
    return client.query(text, values);
  }

  private updateUserByIdWithClient(
    client: PoolClient,
    id: string,
    chatroom: Partial<Chatroom>,
  ) {
    const { cols, values } = entityQueryMapper(chatroom);
    const colsToUpdate = cols.map((col, i) => `${col}=$${i + 2}`).join(',');
    const text = `UPDATE ${this.table} SET ${colsToUpdate} WHERE "id"=$1 RETURNING *;`;
    return client.query(text, [id, ...values]);
  }
}
