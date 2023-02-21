/* eslint-disable @typescript-eslint/no-inferrable-types */
export enum userLevelKeys {
  GAMEID = '"gameId"',
  USERNAME = '"username"',
  LEVEL = '"level"',
}

export interface UserLevelData {
  gameId: string;
  username: string;
  level: number;
}

export class UserLevel {
  gameId: string;
  username: string;
  level: number;

  constructor(userLevelData: UserLevelData) {
    this.gameId = userLevelData.gameId;
    this.username = userLevelData.username;
    this.level = userLevelData.level;
  }
}
