import { Timestamp } from "rxjs";
import { GameType } from "src/shared/enums/game-type.enum";

/* eslint-disable @typescript-eslint/no-inferrable-types */
export enum gameKeys {
  ID = '"id"',
  PLAYERONEID = '"playerOneId"',
  PLAYERTWOID = '"playerTwoId"',
  CREATED_AT = '"createdAt"',
  FINISHED_AT = '"finishedAt"',
  PLAYERONESCORE = '"playerOneScore"',
  PLAYERTWOSCORE = '"playerTwoScore"',
  GAMETYPE = '"gameType"',
}

export interface GameData {
  id: string;
  playerOneId: string;
  playerTwoId: string;
  createdAt: Date;
  gameDuration: number;
  playerOneScore: number;
  playerTwoScore: number;
  gameType: GameType;
}

export class Game {
  id: string;
  playerOneId: string;
  playerTwoId: string;
  createdAt: Date;
  gameDuration: number;
  playerOneScore: number;
  playerTwoScore: number;
  gameType: GameType;

  constructor(gameData: GameData) {
    this.id = gameData.id;
    this.playerOneId = gameData.playerOneId;
    this.playerTwoId = gameData.playerTwoId;
    this.createdAt = gameData.createdAt;
    this.gameDuration = gameData.gameDuration;
    this.playerOneScore = gameData.playerOneScore;
    this.playerTwoScore = gameData.playerTwoScore;
    this.gameType = gameData.gameType;
  }
}
