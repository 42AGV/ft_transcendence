export interface UserLevelWithTimestampData {
  gameId: string;
  username: string;
  timestamp: Date;
  level: number;
}

export class UserLevelWithTimestamp {
  gameId: string;
  username: string;
  timestamp: Date;
  level: number;

  constructor(userLevelData: UserLevelWithTimestampData) {
    this.gameId = userLevelData.gameId;
    this.username = userLevelData.username;
    this.timestamp = userLevelData.timestamp;
    this.level = userLevelData.level;
  }
}
