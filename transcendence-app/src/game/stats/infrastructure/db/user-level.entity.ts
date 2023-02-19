import { GameMode } from 'src/game/enums/game-mode.enum';

/* eslint-disable @typescript-eslint/no-inferrable-types */
export enum userLevelKeys {
  GAMEID = '"gameId"',
  USERNAME = '"username"',
  TIMESTAMP = '"timestamp"',
  LEVEL = '"level"',
}

export interface UserLevelData {
  gameId: string;
  username: string;
  timestamp: Date;
  level: number;
}

export class UserLevel {
  gameId: string;
  username: string;
  timestamp: Date;
  level: number;

  constructor(userLevelData: UserLevelData) {
    this.gameId = userLevelData.gameId;
    this.username = userLevelData.username;
    this.timestamp = userLevelData.timestamp;
    this.level = userLevelData.level;
  }
}
