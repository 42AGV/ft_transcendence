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
      const [waitingPlayer, _] = waitingGame;
      void _;
      this.gameSet.set(gameRoomId, [waitingPlayer, userId]);
      return { [gameRoomId]: [waitingPlayer, userId] };
    }
    return null;
  }

  addGameWithId(gameRoomId: string, [userA, userB]: [string, string]): boolean {
    if (this.gameSet.has(gameRoomId)) {
      return false;
    }
    this.gameSet.set(gameRoomId, [userA, userB]);
    return true;
  }
}
