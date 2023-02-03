import { GameId, UserId } from './memoryModels';

export abstract class IChallengesPendingRepository {
  abstract addGame(userOneId: UserId): Record<GameId, [UserId, null]>;
  abstract retrieveGameForId(
    gameId: GameId,
  ): Record<GameId, [UserId, null]> | null;
  abstract deleteGameForId(gameId: GameId): boolean;
  abstract isPlayerBusy(userId: UserId): boolean;
  abstract getGameRoomForPlayer(
    userId: UserId,
  ): Record<GameId, [UserId, null]> | null;
}
