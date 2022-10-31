import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../../shared/db/models';
import { PostgresPool } from '../../../../../shared/db/postgres/postgresConnection.provider';
import { ChatroomPaginationQueryDto } from '../../../dto/chatroom.pagination.dto';
import {
  entityQueryMapper,
  makeQuery,
} from '../../../../../shared/db/postgres/utils';
import { BooleanString } from '../../../../../shared/enums/boolean-string.enum';
import { LocalFileEntity } from '../../../../../shared/local-file/infrastructure/db/local-file.entity';
import { PoolClient } from 'pg';
import {
  ChatroomEntity,
  ChatroomKeys,
} from '../../../infrastructure/chatroom.entity';
import { IChatroomRepository } from '../../../infrastructure/chatroom.repository';
import { UpdateChatroomDto } from '../../../dto/update-chatroom.dto';

@Injectable()
export class ChatroomPostgresRepository
  extends BasePostgresRepository<ChatroomEntity>
  implements IChatroomRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.CHATS);
  }
  async getById(id: string): Promise<ChatroomEntity | null> {
    const chats = await this.getByKey(ChatroomKeys.ID, id);
    return chats && chats.length ? chats[0] : null;
  }

  async getByChatroomName(chatName: string): Promise<ChatroomEntity | null> {
    const chats = await this.getByKey(ChatroomKeys.NAME, chatName);
    return chats && chats.length ? chats[0] : null;
  }

  async deleteByChatroomName(chatName: string): Promise<ChatroomEntity | null> {
    const chats = await this.deleteByKey(ChatroomKeys.NAME, chatName);
    return chats && chats.length ? chats[0] : null;
  }

  async updateById(
    id: string,
    updateChatDto: UpdateChatroomDto,
  ): Promise<ChatroomEntity | null> {
    const chats = await this.updateByKey(ChatroomKeys.ID, id, updateChatDto);
    return chats && chats.length ? chats[0] : null;
  }

  getPaginatedChatrooms(
    paginationDto: Required<ChatroomPaginationQueryDto>,
  ): Promise<ChatroomEntity[] | null> {
    const { limit, offset, sort, search } = paginationDto;
    const orderBy =
      sort === BooleanString.True ? ChatroomKeys.NAME : ChatroomKeys.ID;
    return makeQuery<ChatroomEntity>(this.pool, {
      text: `SELECT *
      FROM ${this.table}
      WHERE ${ChatroomKeys.NAME} ILIKE $1
      ORDER BY ${orderBy}
      LIMIT $2
      OFFSET $3;`,
      values: [`%${search}%`, limit, offset],
    });
  }

  private insertWithClient(
    client: PoolClient,
    table: table,
    entity: ChatroomEntity | LocalFileEntity,
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
    ChatroomEntity: Partial<ChatroomEntity>,
  ) {
    const { cols, values } = entityQueryMapper(ChatroomEntity);
    const colsToUpdate = cols.map((col, i) => `${col}=$${i + 2}`).join(',');
    const text = `UPDATE ${this.table} SET ${colsToUpdate} WHERE "id"=$1 RETURNING *;`;
    return client.query(text, [id, ...values]);
  }

  async addAvatarAndAddChatroom(
    avatar: LocalFileEntity,
    chatroom: ChatroomEntity,
  ): Promise<ChatroomEntity | null> {
    return this.pool.transaction<ChatroomEntity>(async (client) => {
      const avatarRes = await this.insertWithClient(
        client,
        table.LOCAL_FILE,
        avatar,
      );
      const avatarId = (avatarRes.rows[0] as LocalFileEntity).id;
      const chatRes = await this.insertWithClient(client, table.CHATS, {
        ...chatroom,
        avatarId,
      });
      return chatRes.rows[0];
    });
  }

  async addAvatarAndUpdateChatroom(
    avatar: LocalFileEntity,
    chatroom: ChatroomEntity,
  ): Promise<ChatroomEntity | null> {
    return this.pool.transaction<ChatroomEntity>(async (client) => {
      const avatarRes = await this.insertWithClient(
        client,
        table.LOCAL_FILE,
        avatar,
      );
      const avatarId = (avatarRes.rows[0] as LocalFileEntity).id;
      const chatRes = await this.updateUserByIdWithClient(client, chatroom.id, {
        avatarId,
      });
      return chatRes.rows[0];
    });
  }
}
