import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../shared/db/models';
import { PostgresPool } from '../../../../shared/db/postgres/postgresConnection.provider';
import { ChatsPaginationQueryDto } from '../../../dto/chat.pagination.dto';
import {
  entityQueryMapper,
  makeQuery,
} from '../../../../shared/db/postgres/utils';
import { BooleanString } from '../../../../shared/enums/boolean-string.enum';
import { LocalFileEntity } from '../../../../shared/local-file/infrastructure/db/local-file.entity';
import { PoolClient } from 'pg';
import { ChatRoomEntity, chatKeys } from '../chat.entity';
import { IChatRepository } from '../chat.repository';
import { UpdateChatDto } from '../../../../chat/dto/update-chat.dto';

@Injectable()
export class ChatPostgresRepository
  extends BasePostgresRepository<ChatRoomEntity>
  implements IChatRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.CHATS);
  }
  async getById(id: string): Promise<ChatRoomEntity | null> {
    const chats = await this.getByKey(chatKeys.ID, id);
    return chats && chats.length ? chats[0] : null;
  }

  async getByChatRoomName(chatName: string): Promise<ChatRoomEntity | null> {
    const chats = await this.getByKey(chatKeys.NAME, chatName);
    return chats && chats.length ? chats[0] : null;
  }

  async deleteByChatRoomName(chatName: string): Promise<ChatRoomEntity | null> {
    const chats = await this.deleteByKey(chatKeys.NAME, chatName);
    return chats && chats.length ? chats[0] : null;
  }

  async updateById(
    id: string,
    updateChatDto: UpdateChatDto,
  ): Promise<ChatRoomEntity | null> {
    const chats = await this.updateByKey(chatKeys.ID, id, updateChatDto);
    return chats && chats.length ? chats[0] : null;
  }

  getPaginatedChatRooms(
    paginationDto: Required<ChatsPaginationQueryDto>,
  ): Promise<ChatRoomEntity[] | null> {
    const { limit, offset, sort, search } = paginationDto;
    const orderBy = sort === BooleanString.True ? chatKeys.NAME : chatKeys.ID;
    return makeQuery<ChatRoomEntity>(this.pool, {
      text: `SELECT *
      FROM ${this.table}
      WHERE ${chatKeys.NAME} ILIKE $1
      ORDER BY ${orderBy}
      LIMIT $2
      OFFSET $3;`,
      values: [`%${search}%`, limit, offset],
    });
  }

  private insertWithClient(
    client: PoolClient,
    table: table,
    entity: ChatRoomEntity | LocalFileEntity,
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
    ChatRoomEntity: Partial<ChatRoomEntity>,
  ) {
    const { cols, values } = entityQueryMapper(ChatRoomEntity);
    const colsToUpdate = cols.map((col, i) => `${col}=$${i + 2}`).join(',');
    const text = `UPDATE ${this.table} SET ${colsToUpdate} WHERE "id"=$1 RETURNING *;`;
    return client.query(text, [id, ...values]);
  }

  async addAvatarAndAddChatRoom(
    avatar: LocalFileEntity,
    chatRoom: ChatRoomEntity,
  ): Promise<ChatRoomEntity | null> {
    return this.pool.transaction<ChatRoomEntity>(async (client) => {
      const avatarRes = await this.insertWithClient(
        client,
        table.LOCAL_FILE,
        avatar,
      );
      const avatarId = (avatarRes.rows[0] as LocalFileEntity).id;
      const chatRes = await this.insertWithClient(client, table.CHATS, {
        ...chatRoom,
        avatarId,
      });
      return chatRes.rows[0];
    });
  }

  async addAvatarAndUpdateChatRoom(
    avatar: LocalFileEntity,
    chatRoom: ChatRoomEntity,
  ): Promise<ChatRoomEntity | null> {
    return this.pool.transaction<ChatRoomEntity>(async (client) => {
      const avatarRes = await this.insertWithClient(
        client,
        table.LOCAL_FILE,
        avatar,
      );
      const avatarId = (avatarRes.rows[0] as LocalFileEntity).id;
      const chatRes = await this.updateUserByIdWithClient(client, chatRoom.id, {
        avatarId,
      });
      return chatRes.rows[0];
    });
  }
}
