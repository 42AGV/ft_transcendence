import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../shared/db/models';
import { PostgresPool } from '../../../../shared/db/postgres/postgresConnection.provider';
import { IChatMemberRepository } from '../chatmember.repository';
import {
  ChatMemberEntity,
  chatMembersKeys,
  ChatMemberWithUserEntity,
} from '../chatmember.entity';
import { userKeys } from '../../../../user/infrastructure/db/user.entity';
import { makeQuery } from '../../../../shared/db/postgres/utils';
import { chatKeys } from '../chat.entity';
import { ChatMemberWithUser } from '../../../chatmember.domain';

@Injectable()
export class ChatMemberPostgresRepository
  extends BasePostgresRepository<ChatMemberEntity>
  implements IChatMemberRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.CHATMEMBERS);
  }

  async retrieveChatRoomMembers(
    chatRoomId: string,
  ): Promise<ChatMemberWithUser[] | null> {
    const users = await makeQuery<ChatMemberWithUserEntity>(this.pool, {
      text: `SELECT u.${userKeys.USERNAME},
       u.${userKeys.AVATAR_ID},
       u.${userKeys.AVATAR_X},
       u.${userKeys.AVATAR_Y},
       c.${chatKeys.OWNERID},
       cm.${chatMembersKeys.ADMIN},
       cm.${chatMembersKeys.MUTED},
       cm.${chatMembersKeys.BANNED}
      FROM ${table.USERS} u
      INNER JOIN ${this.table} cm
      ON cm.${chatMembersKeys.USERID} = u.${userKeys.ID}
      LEFT JOIN ${table.CHATS} c
      ON c.${chatKeys.ID} = cm.${chatMembersKeys.CHATID}
      AND u.${userKeys.ID} = c.${chatKeys.OWNERID}
      WHERE cm.${chatMembersKeys.CHATID} = $1`,
      values: [chatRoomId],
    });
    return users && users.length
      ? users.map((user) => new ChatMemberWithUser(user))
      : null;
  }
}
