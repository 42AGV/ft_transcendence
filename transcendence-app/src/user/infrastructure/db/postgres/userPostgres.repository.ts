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
import { plainToInstance } from 'class-transformer';

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
    return users && users.length ? plainToInstance(UserEntity, users[0]) : null;
  }

  async getByUsername(username: string): Promise<UserEntity | null> {
    const users = await this.getByKey(userKeys.USERNAME, username);
    return users && users.length ? plainToInstance(UserEntity, users[0]) : null;
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    const users = await this.getByKey(userKeys.EMAIL, email);
    return users && users.length ? plainToInstance(UserEntity, users[0]) : null;
  }

  async deleteByUsername(username: string): Promise<UserEntity | null> {
    const users = await this.deleteByKey(userKeys.USERNAME, username);
    return users && users.length ? plainToInstance(UserEntity, users[0]) : null;
  }

  async updateById(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity | null> {
    const users = await this.updateByKey(userKeys.ID, id, updateUserDto);
    return users && users.length ? plainToInstance(UserEntity, users[0]) : null;
  }

  async getPaginatedUsers(
    paginationDto: Required<UsersPaginationQueryDto>,
  ): Promise<UserEntity[] | null> {
    const { limit, offset, sort, search } = paginationDto;
    const orderBy =
      sort === BooleanString.True ? userKeys.USERNAME : userKeys.ID;
    const result = await makeQuery<UserEntity>(this.pool, {
      text: `SELECT *
      FROM ${this.table}
      WHERE ${userKeys.USERNAME} ILIKE $1
      ORDER BY ${orderBy}
      LIMIT $2
      OFFSET $3;`,
      values: [`%${search}%`, limit, offset],
    });

    return result
      ? result.map((entity) => plainToInstance(UserEntity, entity))
      : null;
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
    const result = await this.pool.transaction<UserEntity>(async (client) => {
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

    return plainToInstance(UserEntity, result);
  }

  async addAvatarAndUpdateUser(
    avatar: LocalFileEntity,
    user: UserEntity,
  ): Promise<UserEntity | null> {
    const result = await this.pool.transaction<UserEntity>(async (client) => {
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

    return plainToInstance(UserEntity, result);
  }

  async addUser(user: UserEntity): Promise<UserEntity | null> {
    const result = await this.add(user);
    return plainToInstance(UserEntity, result);
  }
}
