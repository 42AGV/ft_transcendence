import { Injectable } from '@nestjs/common';
import { PaginationWithSearchQueryDto } from '../../../../shared/dtos/pagination-with-search.query.dto';
import { table } from '../../../../shared/db/models';
import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { PostgresPool } from '../../../../shared/db/postgres/postgresConnection.provider';
import { makeQuery } from '../../../../shared/db/postgres/utils';
import { Friend, FriendKeys } from '../friend.entity';
import { IFriendRepository } from '../friend.repository';
import { User, UserData, userKeys } from '../user.entity';
import { BooleanString } from '../../../../shared/enums/boolean-string.enum';
import { gameKeys } from '../../../../game/infrastructure/db/game.entity';
import { userLevelKeys } from '../../../../game/stats/infrastructure/db/user-level.entity';
import {
  UserWithLevelData,
  UserWithLevelDto,
} from '../../../../shared/dtos/user-with-level.dto';
import { GameMode } from '../../../../game/enums/game-mode.enum';

@Injectable()
export class FriendPostgresRepository
  extends BasePostgresRepository<Friend>
  implements IFriendRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.FRIEND, Friend);
  }

  addFriend(friend: Friend): Promise<Friend | null> {
    return this.add(friend);
  }

  async getFriend(
    followerId: string,
    followedId: string,
  ): Promise<Friend | null> {
    const friendData = await makeQuery<Friend>(this.pool, {
      text: `SELECT *
      FROM ${this.table}
      WHERE ${FriendKeys.FOLLOWER_ID} = $1 AND ${FriendKeys.FOLLOWED_ID} = $2;`,
      values: [followerId, followedId],
    });
    return friendData && friendData.length
      ? new this.ctor(friendData[0])
      : null;
  }

  async deleteFriend(
    followerId: string,
    followedId: string,
  ): Promise<Friend | null> {
    const friendData = await makeQuery<Friend>(this.pool, {
      text: `DELETE
      FROM ${this.table}
      WHERE ${FriendKeys.FOLLOWER_ID} = $1 AND ${FriendKeys.FOLLOWED_ID} = $2
      RETURNING *;`,
      values: [followerId, followedId],
    });
    return friendData && friendData.length
      ? new this.ctor(friendData[0])
      : null;
  }

  async getFriends(followerId: string): Promise<User[] | null> {
    const usersData = await makeQuery<UserData>(this.pool, {
      text: `SELECT u.*
      FROM ${this.table} f
      JOIN ${table.USERS} u ON (f.${FriendKeys.FOLLOWED_ID} = u.${userKeys.ID})
      WHERE f.${FriendKeys.FOLLOWER_ID} = $1`,
      values: [followerId],
    });
    return usersData ? usersData.map((userData) => new User(userData)) : null;
  }

  async getPaginatedFriends(
    followerId: string,
    paginationDto: Required<PaginationWithSearchQueryDto>,
  ): Promise<UserWithLevelDto[] | null> {
    const { limit, offset, sort, search } = paginationDto;
    const orderBy =
      sort === BooleanString.True ? userKeys.USERNAME : userKeys.ID;
    const usersData = await makeQuery<UserWithLevelData>(this.pool, {
      text: `
          WITH ulevelwithgame AS (SELECT ul.*, g.${gameKeys.CREATED_AT}, g.${gameKeys.GAMEDURATIONINSECONDS}
                                  FROM ${table.USER_LEVEL} ul
                                           INNER JOIN ${table.GAME} g ON ul.${userLevelKeys.GAMEID} = g.${gameKeys.ID}
                                  WHERE g.${gameKeys.GAMEMODE} = '${GameMode.classic}'),
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
                                 WHERE lp."rowNumber" = 1),
               friends AS (SELECT u.*
                           FROM ${this.table} f
                                    JOIN ${table.USERS} u ON (f.${FriendKeys.FOLLOWED_ID} = u.${userKeys.ID})
                           WHERE f.${FriendKeys.FOLLOWER_ID} = $1)
          SELECT CASE WHEN (l.${userLevelKeys.LEVEL} IS NULL) THEN 1 ELSE (l.${userLevelKeys.LEVEL}) END AS "level",
                 f.*
          FROM friends f
                   LEFT JOIN levelprovider l ON f.${userKeys.USERNAME} = l.${userLevelKeys.USERNAME}
          WHERE f.${userKeys.USERNAME} ILIKE $2
          ORDER BY ${orderBy}
          LIMIT $3 OFFSET $4;`,
      values: [followerId, `%${search}%`, limit, offset],
    });
    return usersData
      ? usersData.map((userData) => new UserWithLevelDto(userData))
      : null;
  }
}
