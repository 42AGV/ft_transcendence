import { Injectable } from '@nestjs/common';
import { table } from '../../../../shared/db/models';
import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { PostgresPool } from '../../../../shared/db/postgres/postgresConnection.provider';
import { makeQuery } from '../../../../shared/db/postgres/utils';
import {
  capitalizeFirstLetter,
  removeDoubleQuotes,
} from '../../../../shared/utils';
import { userKeys } from '../../../../user/infrastructure/db/user.entity';
import {
  ChatRoomMessageWithUserEntity,
  ChatRoomMessageWithUserEntityData,
} from '../chat-room-message-with-user.entity';
import {
  ChatRoomMessageEntity,
  ChatRoomMessageKeys,
} from '../chat-room-message.entity';
import { IChatroomMessageRepository } from '../chatroom-message.repository';

@Injectable()
export class ChatroomMessagePostgresRepository
  extends BasePostgresRepository<ChatRoomMessageEntity>
  implements IChatroomMessageRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.CHAT_ROOM_MESSAGE);
  }

  private renameWithPrefix(
    tableName: string,
    columnNames: string[],
    prefix: string,
  ) {
    return columnNames
      .map(
        (name) =>
          `${tableName}.${name} AS "${prefix}${capitalizeFirstLetter(
            removeDoubleQuotes(name),
          )}"`,
      )
      .join(', ');
  }

  async getWithUser(
    chatRoomId: string,
  ): Promise<ChatRoomMessageWithUserEntity[] | null> {
    const messagesData = await makeQuery<ChatRoomMessageWithUserEntityData>(
      this.pool,
      {
        text: `SELECT ${this.table}.*,
        ${this.renameWithPrefix(table.USERS, Object.values(userKeys), 'user')}
      FROM ${this.table}
      INNER JOIN ${table.USERS}
        ON (${this.table}.${ChatRoomMessageKeys.USER_ID} =
            ${table.USERS}.${userKeys.ID})
      WHERE ${ChatRoomMessageKeys.CHAT_ROOM_ID} = $1
      ORDER BY ${ChatRoomMessageKeys.CREATED_AT} ASC`,
        values: [chatRoomId],
      },
    );
    return messagesData
      ? messagesData.map(
          (messageData) => new ChatRoomMessageWithUserEntity(messageData),
        )
      : null;
  }
}
