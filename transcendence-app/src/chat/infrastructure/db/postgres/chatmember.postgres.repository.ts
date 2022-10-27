import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../shared/db/models';
import { PostgresPool } from '../../../../shared/db/postgres/postgresConnection.provider';
import { IChatMemberRepository } from '../chatmember.repository';
import { ChatMemberEntity } from '../chatmember.entity';

@Injectable()
export class ChatMemberPostgresRepository
  extends BasePostgresRepository<ChatMemberEntity>
  implements IChatMemberRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.CHATMEMBERS);
  }
}
