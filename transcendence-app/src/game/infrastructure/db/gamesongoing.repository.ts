import { GameId, UserId } from './memoryModels';

export abstract class IGamesOngoingRepository {
  abstract addGame(userId: UserId): Record<GameId, [UserId, null]>;
  abstract addUserToGame(
    gameRoomId: GameId,
    userId: UserId,
  ): Record<GameId, [UserId, UserId]> | null;
  abstract addGameWithId(gameId: string, users: [string, string]): boolean;
  abstract isPlayerBusy(userId: UserId): boolean;
}
