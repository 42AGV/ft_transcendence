import { Injectable, Logger } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { BaseEntity, table } from '../../../../shared/db/models';
import { UserEntity, userKeys } from '../../db/user.entity';
import { IUserRepository } from '../user.repository';
import { PostgresPool } from '../../../../shared/db/postgres/postgresConnection.provider';
import { UsersPaginationQueryDto } from '../../../dto/user.pagination.dto';
import {
  entityQueryMapper,
  isCriticalDatabaseError,
  makeQuery,
} from '../../../../shared/db/postgres/utils';
import { BooleanString } from '../../../../shared/enums/boolean-string.enum';
import { LocalFileEntity } from '../../../../shared/local-file/infrastructure/db/local-file.entity';
import { PoolClient } from 'pg';

@Injectable()
export class UserPostgresRepository
  extends BasePostgresRepository<UserEntity>
  implements IUserRepository
{
  private logger = new Logger(UserPostgresRepository.name);

  constructor(protected pool: PostgresPool) {
    super(pool, table.USERS);
  }

  async getById(id: string): Promise<UserEntity | null> {
    const users = await this.getByKey(userKeys.ID, id);
    return users && users.length ? users[0] : null;
  }

  async getByUsername(username: string): Promise<UserEntity | null> {
    const users = await this.getByKey(userKeys.USERNAME, username);
    return users && users.length ? users[0] : null;
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    const users = await this.getByKey(userKeys.EMAIL, email);
    return users && users.length ? users[0] : null;
  }

  async deleteByUsername(username: string): Promise<UserEntity | null> {
    const users = await this.deleteByKey(userKeys.USERNAME, username);
    return users && users.length ? users[0] : null;
  }

  async updateByUsername(
    username: string,
    user: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    const users = await this.updateByKey(userKeys.USERNAME, username, user);
    return users && users.length ? users[0] : null;
  }

  getPaginatedUsers(
    paginationDto: Required<UsersPaginationQueryDto>,
  ): Promise<UserEntity[] | null> {
    const { limit, offset, sort } = paginationDto;
    const orderBy =
      sort === BooleanString.True ? userKeys.USERNAME : userKeys.ID;
    return makeQuery<UserEntity>(this.pool, {
      text: `SELECT *
      FROM ${this.table}
      ORDER BY "${orderBy}"
      LIMIT $1
      OFFSET $2;`,
      values: [limit, offset],
    });
  }

  private insertWithClient(
    client: PoolClient,
    table: table,
    entity: BaseEntity,
  ) {
    const { cols, params, values } = entityQueryMapper(entity);
    const text = `INSERT INTO ${table}(${cols.join(
      ', ',
    )}) VALUES (${params.join(',')}) RETURNING *;`;
    return client.query(text, values);
  }

  async addAvatarAndAddUser(
    avatar: LocalFileEntity,
    user: UserEntity,
  ): Promise<UserEntity | null> {
    let userEntity: UserEntity | null;
    try {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');
        const avatarRes = await this.insertWithClient(
          client,
          table.LOCAL_FILE,
          avatar,
        );
        user.avatarId = (avatarRes.rows[0] as LocalFileEntity).id;
        const userRes = await this.insertWithClient(client, table.USERS, user);
        await client.query('COMMIT');
        userEntity = userRes.rows[0];
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
      return userEntity;
    } catch (err) {
      if (isCriticalDatabaseError(err)) {
        this.logger.error(err.message);
      }
      return null;
    }
  }
}
