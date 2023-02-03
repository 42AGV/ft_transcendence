import { GameId, UserId } from './memoryModels';

export abstract class IGamesOngoingRepository {
  abstract addGame(userId: UserId): Record<GameId, [UserId, null]>;
  abstract addUserToGame(
    gameRoomId: GameId,
    userId: UserId,
  ): Record<GameId, [UserId, UserId]> | null;
  abstract addGameWithId(
    gameId: string,
    [userA, userB]: [string, string],
  ): boolean;
  abstract retrieveGameForId(
    gameId: GameId,
  ): Record<GameId, [UserId, UserId | null]> | null;
  abstract deleteGameForId(gameId: GameId): boolean;
  abstract isPlayerBusy(userId: UserId): boolean;
  abstract getGameRoomForPlayer(
    userId: UserId,
  ): Record<GameId, [UserId, UserId | null]> | null;
}
