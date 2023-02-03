import { GameMode } from 'src/shared/enums/game-mode.enum';

/* eslint-disable @typescript-eslint/no-inferrable-types */
export enum gameKeys {
  ID = '"id"',
  PLAYERONEID = '"playerOneId"',
  PLAYERTWOID = '"playerTwoId"',
  CREATED_AT = '"createdAt"',
  GAMEDURATION = '"gameDuration"',
  PLAYERONESCORE = '"playerOneScore"',
  PLAYERTWOSCORE = '"playerTwoScore"',
  GAMEMODE = '"gameMode"',
}

export interface GameData {
  id: string;
  playerOneId: string;
  playerTwoId: string;
  createdAt: Date;
  gameDuration: number;
  playerOneScore: number;
  playerTwoScore: number;
  gameMode: GameMode;
}

export class Game {
  id: string;
  playerOneId: string;
  playerTwoId: string;
  createdAt: Date;
  gameDuration: number;
  playerOneScore: number;
  playerTwoScore: number;
  gameMode: GameMode;

  constructor(gameData: GameData) {
    this.id = gameData.id;
    this.playerOneId = gameData.playerOneId;
    this.playerTwoId = gameData.playerTwoId;
    this.createdAt = gameData.createdAt;
    this.gameDuration = gameData.gameDuration;
    this.playerOneScore = gameData.playerOneScore;
    this.playerTwoScore = gameData.playerTwoScore;
    this.gameMode = gameData.gameMode;
  }
}
