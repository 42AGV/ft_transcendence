import { GameId, UserId } from './memoryModels';

export abstract class IChallengesPendingRepository {
  abstract addGame(
    userOneId: UserId,
    userTwoId: UserId,
  ): Record<GameId, [UserId, UserId]>;
  abstract retrieveGameForId(
    gameId: GameId,
  ): Record<GameId, [UserId, UserId]> | null;
  abstract deleteGameForId(gameId: GameId): boolean;
  abstract isPlayerBusy(userId: UserId): boolean;
  abstract getGameRoomForPlayer(
    userId: UserId,
  ): Record<GameId, [UserId, UserId]> | null;
}
