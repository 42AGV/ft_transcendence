import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../shared/db/models';
import { User, userKeys } from '../../db/user.entity';
import { IUserRepository } from '../user.repository';
import { PostgresPool } from '../../../../shared/db/postgres/postgresConnection.provider';
import {
  makeQuery,
  makeTransactionalQuery,
} from '../../../../shared/db/postgres/utils';
import { BooleanString } from '../../../../shared/enums/boolean-string.enum';
import { LocalFile } from '../../../../shared/local-file/infrastructure/db/local-file.entity';
import { AuthProviderType } from '../../../../auth/auth-provider/auth-provider.service';
import { PaginationWithSearchQueryDto } from '../../../../shared/dtos/pagination-with-search.query.dto';
import { gameKeys } from '../../../../game/infrastructure/db/game.entity';
import { userLevelKeys } from '../../../../game/stats/infrastructure/db/user-level.entity';

@Injectable()
export class UserPostgresRepository
  extends BasePostgresRepository<User>
  implements IUserRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.USERS, User);
  }

  async getById(id: string): Promise<User | null> {
    const users = await this.getByKey(userKeys.ID, id);
    return users && users.length ? users[0] : null;
  }

  async getByUsername(username: string): Promise<User | null> {
    const users = await this.getByKey(userKeys.USERNAME, username);
    return users && users.length ? users[0] : null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const users = await this.getByKey(userKeys.EMAIL, email);
    return users && users.length ? users[0] : null;
  }

  async deleteByUsername(username: string): Promise<User | null> {
    const users = await this.deleteByKey(userKeys.USERNAME, username);
    return users && users.length ? users[0] : null;
  }

  async updateById(
    id: string,
    updateUser: Partial<User>,
  ): Promise<User | null> {
    const users = await this.updateByKey(userKeys.ID, id, updateUser);
    return users && users.length ? users[0] : null;
  }

  async getPaginatedUsers(
    paginationDto: Required<PaginationWithSearchQueryDto>,
  ): Promise<User[] | null> {
    const { limit, offset, sort, search } = paginationDto;
    const orderBy =
      sort === BooleanString.True ? userKeys.USERNAME : userKeys.ID;
    const usersData = await makeQuery<User>(this.pool, {
      text: `
          WITH ulevelwithgame AS (SELECT ul.*, g.${gameKeys.CREATED_AT}, g.${gameKeys.GAMEDURATIONINSECONDS}
                                  FROM ${table.USER_LEVEL} ul
                                           INNER JOIN ${table.GAME} g ON ul.${userLevelKeys.GAMEID} = g.${gameKeys.ID}),
               ulevelwithtime
                   AS (SELECT (ulg.${gameKeys.CREATED_AT} + INTERVAL '1 second' * ulg.${gameKeys.GAMEDURATIONINSECONDS}) AS "timestamp",
                              ulg.${userLevelKeys.USERNAME},
                              ulg.${userLevelKeys.LEVEL}                                                                 AS "level"
                       FROM ulevelwithgame ulg),
               partlevel AS (SELECT ult.${userLevelKeys.USERNAME},
                                    ult.${userLevelKeys.LEVEL},
                                    ROW_NUMBER() OVER (
                                        PARTITION BY ult.${userLevelKeys.USERNAME}
                                        ORDER BY ult."timestamp" DESC
                                        ) AS "rowNumber"
                             FROM ulevelwithtime ult),
               levelprovider AS (SELECT lp.*
                                 FROM partlevel lp
                                 WHERE lp."rowNumber" = 1)
          SELECT CASE WHEN (l.${userLevelKeys.LEVEL} IS NULL) THEN 1 ELSE (l.${userLevelKeys.LEVEL}) END AS ${userKeys.LEVEL},
                 u.*
          FROM ${this.table} u
                   LEFT JOIN levelprovider l ON u.${userKeys.USERNAME} = l.${userLevelKeys.USERNAME}
          WHERE ${userKeys.USERNAME} ILIKE $1
          ORDER BY ${orderBy}
          LIMIT $2 OFFSET $3;`,
      values: [`%${search}%`, limit, offset],
    });
    return usersData ? usersData.map((user) => new this.ctor(user)) : null;
  }

  async addAvatarAndAddUser(
    avatar: LocalFile,
    user: User,
  ): Promise<User | null> {
    const userData = await makeTransactionalQuery<User>(
      this.pool,
      async (client) => {
        const avatarRes = await this.insertWithClient(
          client,
          table.LOCAL_FILE,
          avatar,
        );
        const avatarId = (avatarRes.rows[0] as LocalFile).id;
        const userRes = await this.insertWithClient(client, table.USERS, {
          ...user,
          avatarId,
        });
        return userRes.rows[0];
      },
    );
    return userData ? new this.ctor(userData) : null;
  }

  async addAvatarAndUpdateUser(
    avatar: LocalFile,
    user: User,
  ): Promise<User | null> {
    const userData = await makeTransactionalQuery<User>(
      this.pool,
      async (client) => {
        const avatarRes = await this.insertWithClient(
          client,
          table.LOCAL_FILE,
          avatar,
        );
        const avatarId = (avatarRes.rows[0] as LocalFile).id;
        const userRes = await this.updateByIdWithClient(
          client,
          this.table,
          user.id,
          {
            avatarId,
          },
        );
        return userRes.rows[0];
      },
    );
    return userData ? new this.ctor(userData) : null;
  }

  async getByAuthProvider(
    provider: AuthProviderType,
    providerId: string,
  ): Promise<User | null> {
    const usersData = await makeQuery<User>(this.pool, {
      text: `SELECT u.*
      FROM ${this.table} u
      INNER JOIN ${table.AUTH_PROVIDER} ap
      ON u."id" = ap."userId"
      WHERE ap."provider" = $1 AND ap."providerId" = $2;`,
      values: [provider, providerId],
    });
    return usersData && usersData.length ? new this.ctor(usersData[0]) : null;
  }
}
