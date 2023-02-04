import { GameId, UserId } from '.';
import { GameSet } from './gameset.abstract.model';
import { IGamesOngoingRepository } from '../gamesongoing.repository';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GamesOngoing
  extends GameSet<UserId | null>
  implements IGamesOngoingRepository
{
  constructor() {
    super();
  }

  addGame(userId: UserId): Record<GameId, [UserId, null]> {
    const gameId: GameId = uuidv4();
    this.gameSet.set(gameId, [userId, null]);
    this.usersBusy.add(userId);
    return { [gameId]: [userId, null] };
  }

  addUserToGame(
    gameRoomId: GameId,
    userId: UserId,
  ): Record<GameId, [UserId, UserId]> | null {
    const waitingGame = this.gameSet.get(gameRoomId);
    if (waitingGame) {
      const waitingPlayer = waitingGame[0];
      this.gameSet.set(gameRoomId, [waitingPlayer, userId]);
      return { [gameRoomId]: [waitingPlayer, userId] };
    }
    return null;
  }

  addGameWithId(gameRoomId: string, users: [string, string]): boolean {
    if (this.gameSet.has(gameRoomId)) {
      return false;
    }
    this.gameSet.set(gameRoomId, users);
    return true;
  }

  isPlayerPlaying(userId: UserId): boolean {
    const game = this.getGameRoomForPlayer(userId);
    if (!game) {
      return false;
    }
    return Object.values(game)[0][1] !== null;
  }
}
