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
    blockerId: string,
    blockedId: string,
  ): Promise<Friend | null> {
    const friendData = await makeQuery<Friend>(this.pool, {
      text: `DELETE
      FROM ${this.table}
      WHERE ${FriendKeys.FOLLOWER_ID} = $1 AND ${FriendKeys.FOLLOWED_ID} = $2
      RETURNING *;`,
      values: [blockerId, blockedId],
    });
    return friendData && friendData.length
      ? new this.ctor(friendData[0])
      : null;
  }

  async getFriends(followerId: string): Promise<User[] | null> {
    const usersData = await makeQuery<UserData>(this.pool, {
      text: `SELECT u.*
      FROM ${this.table} b
      JOIN ${table.USERS} u ON (b.${FriendKeys.FOLLOWED_ID} = u.${userKeys.ID})
      WHERE b.${FriendKeys.FOLLOWER_ID} = $1`,
      values: [followerId],
    });
    return usersData ? usersData.map((userData) => new User(userData)) : null;
  }

  async getPaginatedFriends(
    followerId: string,
    paginationDto: Required<PaginationWithSearchQueryDto>,
  ): Promise<User[] | null> {
    const { limit, offset, sort, search } = paginationDto;
    const orderBy =
      sort === BooleanString.True ? userKeys.USERNAME : userKeys.ID;
    const usersData = await makeQuery<User>(this.pool, {
      text: `SELECT u.*
      FROM ${this.table} b
      JOIN ${table.USERS} u ON (b.${FriendKeys.FOLLOWED_ID} = u.${userKeys.ID})
      WHERE b.${FriendKeys.FOLLOWER_ID} = $1 AND u.${userKeys.USERNAME} ILIKE $2
      ORDER BY ${orderBy}
      LIMIT $3
      OFFSET $4;`,
      values: [followerId, `%${search}%`, limit, offset],
    });
    return usersData ? usersData.map((userData) => new User(userData)) : null;
  }
}
