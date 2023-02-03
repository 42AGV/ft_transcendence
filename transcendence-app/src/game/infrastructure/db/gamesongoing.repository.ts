import { GameId, UserId } from './memoryModels';

export abstract class IGamesOngoingRepository {
  abstract addGame(
    userOneId: UserId,
    userTwoId: UserId,
  ): Record<GameId, [UserId, UserId]>;
  abstract retrieveGameForId(
    gameId: GameId,
  ): Record<GameId, [UserId, UserId]> | null;
  abstract deleteGameForId(gameId: GameId): boolean;
  abstract isPlayerBusy(userId: UserId): boolean;
  abstract getOpponentForPlayer(userId: UserId): UserId | null;
  abstract getGameRoomForPlayer(
    userId: UserId,
  ): Record<GameId, [UserId, UserId]> | null;
}
