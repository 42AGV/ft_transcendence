import { GameId, UserId } from './memoryModels';
import { GamePairing } from './game-pairing.entity';

export abstract class IChallengesPendingRepository {
  abstract addGame(userOneId: UserId, userTwoId: UserId): GamePairing;
  abstract retrieveGameForId(gameId: GameId): GamePairing | null;
  abstract deleteGameForId(gameId: GameId): GamePairing | null;
  abstract isPlayerBusy(userId: UserId): boolean;
  abstract getGameRoomForPlayer(userId: UserId): GamePairing | null;
}
