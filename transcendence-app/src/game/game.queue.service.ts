import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter2 } from '@nestjs/event-emitter';

type UserId = string;
type GameId = string;

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
  waitingGameRoom: GameId | null = null;
  userToGameRoom = new Map<UserId, GameId>();
  gameRoomToUsers = new Map<GameId, [UserId, UserId]>();

  constructor(private eventEmitter: EventEmitter2) {}

  async joinGameQueue(userId: string): Promise<string | null> {
    if (!this.socket) {
      return null;
    }
    if (!this.waitingGameRoom) {
      this.waitingGameRoom = uuidv4();
      this.userToGameRoom.set(userId, this.waitingGameRoom);
      this.socket.emit('waitingForGame', {
        gameRoomId: this.waitingGameRoom,
      });
      return this.waitingGameRoom;
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
