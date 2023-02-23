import { GameMode } from '../../../enums/game-mode.enum';

export interface UserLevelWithTimestampData {
  gameId: string;
  username: string;
  gameMode: GameMode;
  timestamp: Date;
  level: number;
}

export class UserLevelWithTimestamp {
  gameId: string;
  username: string;
  gameMode: GameMode;
  timestamp: Date;
  level: number;

  constructor(userLevelData: UserLevelWithTimestampData) {
    this.gameId = userLevelData.gameId;
    this.username = userLevelData.username;
    this.gameMode = userLevelData.gameMode;
    this.timestamp = userLevelData.timestamp;
    this.level = userLevelData.level;
  }
}
