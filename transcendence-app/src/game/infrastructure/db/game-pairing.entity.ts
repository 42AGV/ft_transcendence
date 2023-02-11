export interface GamePairingData {
  readonly gameRoomId: string;
  readonly userOneId: string;
  readonly userTwoId?: string;
}

export class GamePairing {
  readonly gameRoomId: string;
  readonly userOneId: string;
  readonly userTwoId?: string;
  constructor({ userOneId, userTwoId, gameRoomId }: GamePairingData) {
    this.gameRoomId = gameRoomId;
    this.userOneId = userOneId;
    this.userTwoId = userTwoId;
  }
}
