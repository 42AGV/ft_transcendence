export enum GameQueueStatus {
  NONE = 'none',
  PLAYING = 'playing',
  WAITING = 'waiting',
}

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
