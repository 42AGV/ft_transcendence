import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GameId, UserId } from './infrastructure/db/memoryModels';
import { IGamesOngoingRepository } from './infrastructure/db/gamesongoing.repository';
import { IChallengesPendingRepository } from './infrastructure/db/challengespending.repository';

interface GameReadyData {
  accepted: boolean;
  gameRoomId: string;
}

export class GameReady {
  accepted: boolean;
  gameRoomId: string;

  constructor({ accepted, gameRoomId }: GameReadyData) {
    this.accepted = accepted;
    this.gameRoomId = gameRoomId;
  }
}

@Injectable()
export class GameQueueService {
  public socket: Server | null = null;
  gameQueue: UserId | null = null;
  constructor(
    private eventEmitter: EventEmitter2,
    private gamesOngoing: IGamesOngoingRepository,
    private challengesPending: IChallengesPendingRepository,
  ) {}

  async gameQueueJoin(userId: string): Promise<string | null> {
    if (!this.socket) {
      return null;
    }
    if (!this.gameQueue) {
      this.gameQueue = userId;
      return userId;
    } else {
      // TODO: from two different tabs, or just reloading, we can get here, which is not cool
      const gameRoomId = this.waitingGameRoom;
      this.userToGameRoom.set(userId, gameRoomId);
      this.waitingGameRoom = null;
      this.eventEmitter.emit(
        'game.ready',
        new GameReady({
          accepted: true,
          gameRoomId,
        }),
      );
      this.socket.emit('gameReady', {
        accepted: true,
        gameRoomId,
      });
      return gameRoomId;
    }
  }

  getRoomForUserId(userId: string): GameId | undefined {
    return this.userToGameRoom.get(userId);
  }

  deleteRoom(gameRoomId: string) {
    this.userToGameRoom.delete(gameRoomId);
  }
}
