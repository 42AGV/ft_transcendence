import { GameId, UserId } from './types';
import { GamePairing } from '../game-pairing.entity';

export abstract class GameSet {
  protected readonly gameSet: Map<GameId, [UserId, UserId | undefined]>;
  protected readonly usersBusy: Set<UserId>;

  protected constructor() {
    this.gameSet = new Map<GameId, [UserId, UserId | undefined]>();
    this.usersBusy = new Set<UserId>();
  }

  retrieveGameForId(gameRoomId: GameId): GamePairing | null {
    const game = this.gameSet.get(gameRoomId);
    if (game) {
      return new GamePairing({
        gameRoomId,
        userOneId: game[0],
        userTwoId: game[1],
      });
    }
    return null;
  }

  deleteGameForId(gameRoomId: GameId): GamePairing | null {
    const entry = this.gameSet.get(gameRoomId);
    if (entry) {
      const [userOneId, userTwoId] = entry;
      this.usersBusy.delete(userOneId);
      userTwoId && this.usersBusy.delete(userTwoId);
      this.gameSet.delete(gameRoomId);
      return new GamePairing({
        gameRoomId,
        userOneId,
        userTwoId,
      });
    }
    return null;
  }

  isPlayerBusy(userId: UserId): boolean {
    return this.usersBusy.has(userId);
  }

  getGameRoomForPlayer(userId: UserId): GamePairing | null {
    for (const [gameRoomId, [userOneId, userTwoId]] of this.gameSet) {
      if (userOneId === userId || userTwoId === userId) {
        return new GamePairing({
          gameRoomId,
          userOneId,
          userTwoId,
        });
      }
    }
    return null;
  }
}
