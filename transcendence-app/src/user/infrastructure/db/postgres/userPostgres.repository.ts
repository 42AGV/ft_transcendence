import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../shared/db/models';
import { UserEntity, userKeys } from '../../db/user.entity';
import { IUserRepository } from '../user.repository';
import { PostgresPool } from '../../../../shared/db/postgres/postgresConnection.provider';
import { UsersPaginationQueryDto } from '../../../dto/user.pagination.dto';
import {
  entityQueryMapper,
  makeQuery,
} from '../../../../shared/db/postgres/utils';
import { BooleanString } from '../../../../shared/enums/boolean-string.enum';
import { LocalFileEntity } from '../../../../shared/local-file/infrastructure/db/local-file.entity';
import { PoolClient } from 'pg';
import { UpdateUserDto } from '../../../dto/update-user.dto';
import { AuthProviderType } from '../../../../auth/auth-provider/auth-provider.service';

@Injectable()
export class UserPostgresRepository
  extends BasePostgresRepository<UserEntity>
  implements IUserRepository
{
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

  async updateById(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity | null> {
    const users = await this.updateByKey(userKeys.ID, id, updateUserDto);
    return users && users.length ? users[0] : null;
  }

  getPaginatedUsers(
    paginationDto: Required<UsersPaginationQueryDto>,
  ): Promise<UserEntity[] | null> {
    const { limit, offset, sort, search } = paginationDto;
    const orderBy =
      sort === BooleanString.True ? userKeys.USERNAME : userKeys.ID;
    return makeQuery<UserEntity>(this.pool, {
      text: `SELECT *
      FROM ${this.table}
      WHERE ${userKeys.USERNAME} ILIKE $1
      ORDER BY ${orderBy}
      LIMIT $2
      OFFSET $3;`,
      values: [`%${search}%`, limit, offset],
    });
  }

  private insertWithClient(
    client: PoolClient,
    table: table,
    entity: UserEntity | LocalFileEntity,
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
    userEntity: Partial<UserEntity>,
  ) {
    const { cols, values } = entityQueryMapper(userEntity);
    const colsToUpdate = cols.map((col, i) => `${col}=$${i + 2}`).join(',');
    const text = `UPDATE ${this.table} SET ${colsToUpdate} WHERE "id"=$1 RETURNING *;`;
    return client.query(text, [id, ...values]);
  }

  async addAvatarAndAddUser(
    avatar: LocalFileEntity,
    user: UserEntity,
  ): Promise<UserEntity | null> {
    return this.pool.transaction<UserEntity>(async (client) => {
      const avatarRes = await this.insertWithClient(
        client,
        table.LOCAL_FILE,
        avatar,
      );
      const avatarId = (avatarRes.rows[0] as LocalFileEntity).id;
      const userRes = await this.insertWithClient(client, table.USERS, {
        ...user,
        avatarId,
      });
      return userRes.rows[0];
    });
  }

  async addAvatarAndUpdateUser(
    avatar: LocalFileEntity,
    user: UserEntity,
  ): Promise<UserEntity | null> {
    return this.pool.transaction<UserEntity>(async (client) => {
      const avatarRes = await this.insertWithClient(
        client,
        table.LOCAL_FILE,
        avatar,
      );
      const avatarId = (avatarRes.rows[0] as LocalFileEntity).id;
      const userRes = await this.updateUserByIdWithClient(client, user.id, {
        avatarId,
      });
      return userRes.rows[0];
    });
  }

  async getByAuthProvider(
    provider: AuthProviderType,
    providerId: string,
  ): Promise<UserEntity | null> {
    const users = await makeQuery<UserEntity>(this.pool, {
      text: `SELECT u.*
      FROM ${this.table} u
      INNER JOIN ${table.AUTH_PROVIDER} ap
      ON u."id" = ap."userId"
      WHERE ap."provider" = $1 AND ap."providerId" = $2;`,
      values: [provider, providerId],
    });
    return users && users.length ? users[0] : null;
  }
}
