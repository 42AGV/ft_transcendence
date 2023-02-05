import { GameId, UserId } from './memoryModels';
import { GamePairing } from './game-pairing.entity';

export abstract class IGamesOngoingRepository {
  abstract addGame(userId: UserId): GamePairing;
  abstract addUserToGame(
    gameRoomId: GameId,
    userId: UserId,
  ): GamePairing | null;
  abstract addGameWithId(gameId: string, users: [string, string]): boolean;
  abstract isPlayerBusy(userId: UserId): boolean;
  abstract isPlayerPlaying(userId: UserId): boolean;
  abstract getGameRoomForPlayer(userId: UserId): GamePairing | null;
  abstract deleteGameForId(gameId: GameId): boolean;
}
