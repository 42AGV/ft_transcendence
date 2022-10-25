import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../shared/db/models';
import { PostgresPool } from '../../../../shared/db/postgres/postgresConnection.provider';
import { IChatMemberRepository } from '../chatmember.repository';
import { ChatMemberEntity } from '../chatmember.entity';
// import { ChatMember } from '../../../chat.domain';
// import { UpdateChatMemberDto } from '../../../dto/update-chatmember.dto';

@Injectable()
export class ChatMemberPostgresRepository
  extends BasePostgresRepository<ChatMemberEntity>
  implements IChatMemberRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.CHATMEMBERS);
  }
  // getByChatId(chatId: string): Promise<ChatMember[] | null> {}
  // getByUserId(userId: string): Promise<ChatMember[] | null> {}
  // updateByChatIdAndUserId(
  //   chatId: string,
  //   userId: string,
  //   updateChatMemberDto: UpdateChatMemberDto,
  // ): Promise<ChatMember | null> {}
}
