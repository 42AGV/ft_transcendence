import { GameMode } from 'src/game/enums/game-mode.enum';

/* eslint-disable @typescript-eslint/no-inferrable-types */
export enum userLevelKeys {
  USERNAME = '"username"',
  TIMESTAMP = '"timestamp"',
  LEVEL = '"level"',
  GAMEMODE = '"gameMode"',
}

export interface UserLevelData {
  username: string;
  timestamp: Date;
  level: number;
  gameMode: GameMode;
}

export class UserLevel {
  username: string;
  timestamp: Date;
  level: number;
  gameMode: GameMode;

  constructor(gameData: UserLevelData) {
    this.username = gameData.username;
    this.timestamp = gameData.timestamp;
    this.level = gameData.level;
    this.gameMode = gameData.gameMode;
  }
}
