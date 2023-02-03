import { GameId, UserId } from './types';

export abstract class GameSet<T> {
  protected readonly gameSet: Map<GameId, [UserId, T]>;
  protected readonly usersBusy: Set<UserId | T>;

  protected constructor() {
    this.gameSet = new Map<GameId, [UserId, T]>();
    this.usersBusy = new Set<UserId | T>();
  }

  abstract addGame(userOneId: UserId | T): Record<GameId, [UserId, T]>;

  retrieveGameForId(gameId: GameId): Record<GameId, [UserId, T]> | null {
    const game = this.gameSet.get(gameId);
    if (game) return { [gameId]: game };
    return null;
  }

  deleteGameForId(gameId: GameId): boolean {
    const entry = this.gameSet.get(gameId);
    if (entry) {
      this.usersBusy.delete(entry[0]);
      this.usersBusy.delete(entry[1]);
      return this.gameSet.delete(gameId);
    }
    return false;
  }

  isPlayerBusy(userId: UserId): boolean {
    return this.usersBusy.has(userId);
  }

  getOpponentForPlayer(userId: UserId): UserId | T | null {
    for (const [_, [userA, userB]] of this.gameSet) {
      if (userA === userId) {
        return userB;
      } else if (userB === userId) {
        return userA;
      }
    }
    return null;
  }

  getGameRoomForPlayer(userId: UserId): Record<GameId, [UserId, T]> | null {
    for (const [key, [userA, userB]] of this.gameSet) {
      if (userA === userId || userB === userId) {
        return { [key]: [userA, userB] };
      }
    }
    return null;
  }
}
