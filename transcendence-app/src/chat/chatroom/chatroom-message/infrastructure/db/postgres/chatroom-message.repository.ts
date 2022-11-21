import { Injectable } from '@nestjs/common';
import { table } from '../../../../../../shared/db/models';
import { BasePostgresRepository } from '../../../../../../shared/db/postgres/postgres.repository';
import { PostgresPool } from '../../../../../../shared/db/postgres/postgresConnection.provider';
import { makeQuery } from '../../../../../../shared/db/postgres/utils';
import { PaginationQueryDto } from '../../../../../../shared/dtos/pagination.query.dto';
import {
  capitalizeFirstLetter,
  removeDoubleQuotes,
} from '../../../../../../shared/utils';
import { userKeys } from '../../../../../../user/infrastructure/db/user.entity';
import {
  ChatroomMessageWithUser,
  ChatroomMessageWithUserData,
} from '../chatroom-message-with-user.entity';
import {
  ChatroomMessage,
  ChatroomMessageKeys,
} from '../chatroom-message.entity';
import { IChatroomMessageRepository } from '../chatroom-message.repository';

@Injectable()
export class ChatroomMessagePostgresRepository
  extends BasePostgresRepository<ChatroomMessage>
  implements IChatroomMessageRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.CHATROOM_MESSAGE, ChatroomMessage);
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
    { limit, offset }: Required<PaginationQueryDto>,
  ): Promise<ChatroomMessageWithUser[] | null> {
    const messagesData = await makeQuery<ChatroomMessageWithUserData>(
      this.pool,
      {
        text: `SELECT ${this.table}.*,
        ${this.renameWithPrefix(table.USERS, Object.values(userKeys), 'user')}
      FROM ${this.table}
      INNER JOIN ${table.USERS}
        ON (${this.table}.${ChatroomMessageKeys.USER_ID} =
            ${table.USERS}.${userKeys.ID})
      WHERE ${ChatroomMessageKeys.CHATROOM_ID} = $1
      ORDER BY ${ChatroomMessageKeys.SEQUENCE} DESC
      LIMIT $2
      OFFSET $3;`,
        values: [chatRoomId, limit, offset],
      },
    );
    return messagesData
      ? messagesData.map(
          (messageData) => new ChatroomMessageWithUser(messageData),
        )
      : null;
  }
}
