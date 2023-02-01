import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

type UserId = string;
type GameId = string;

@Injectable()
export class GameQueueService {
  public socket: Server | null = null;
  waitingGameRoom: GameId | null = null;
  waitingGameRooms = new Map<UserId, GameId>();

  constructor() {}

  async joinGameQueue(userId: string): Promise<string | null> {
    if (!this.socket) {
      return null;
    }
    if (!this.waitingGameRoom) {
      this.waitingGameRoom = uuidv4();
      this.waitingGameRooms.set(userId, this.waitingGameRoom);
      this.socket.emit('waitingForGame', {
        gameRoomId: this.waitingGameRoom,
      });
      return this.waitingGameRoom;
    } else {
      // TODO: from two different tabs, or just reloading, we can get here, which is not cool
      const gameRoomId = this.waitingGameRoom;
      this.waitingGameRooms.set(userId, gameRoomId);
      this.waitingGameRoom = null;
      this.socket.emit('gameReady', {
        accepted: true,
        gameRoomId,
      });
      return null;
    }
  }

  getRoomForUserId(userId: string): GameId | undefined {
    return this.waitingGameRooms.get(userId);
  }

  deleteRoom(gameRoomId: string) {
    this.waitingGameRooms.delete(gameRoomId);
  }
}
