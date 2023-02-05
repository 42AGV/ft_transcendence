import { GameQueueStatus } from 'pong-engine';

export interface GamePairingStatusData {
  gameRoomId: string | null;
  gameQueueStatus: GameQueueStatus;
}

export class GamePairingStatusDto {
  gameRoomId: string | null;
  gameQueueStatus: GameQueueStatus;

  constructor({ gameRoomId, gameQueueStatus }: GamePairingStatusData) {
    this.gameRoomId = gameRoomId;
    this.gameQueueStatus = gameQueueStatus;
  }
}
