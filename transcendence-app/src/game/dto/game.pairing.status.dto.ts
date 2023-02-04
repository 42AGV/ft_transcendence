export interface GamePairingStatusData {
  isPlaying: boolean;
  gameRoomId: string | null;
  isWaitingToPlay: boolean;
}

export class GamePairingStatusDto {
  isPlaying: boolean;
  gameRoomId: string | null;
  isWaitingToPlay: boolean;

  constructor({
    isPlaying,
    gameRoomId,
    isWaitingToPlay,
  }: GamePairingStatusData) {
    this.isPlaying = isPlaying;
    this.gameRoomId = gameRoomId;
    this.isWaitingToPlay = isWaitingToPlay;
  }
}
