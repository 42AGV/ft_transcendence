import { GameMode } from 'src/game/enums/game-mode.enum';

/* eslint-disable @typescript-eslint/no-inferrable-types */
export enum gameKeys {
  ID = '"id"',
  PLAYERONEUSERNAME = '"playerOneUsername"',
  PLAYERTWOUSERNAME = '"playerTwoUsername"',
  CREATED_AT = '"createdAt"',
  GAMEDURATIONINSECONDS = '"gameDurationInSeconds"',
  PLAYERONESCORE = '"playerOneScore"',
  PLAYERTWOSCORE = '"playerTwoScore"',
  GAMEMODE = '"gameMode"',
}

export interface GameData {
  id: string;
  playerOneUsername: string;
  playerTwoUsername: string;
  createdAt: Date;
  gameDurationInSeconds: number;
  playerOneScore: number;
  playerTwoScore: number;
  gameMode: GameMode;
}

export class Game {
  id: string;
  playerOneUsername: string;
  playerTwoUsername: string;
  createdAt: Date;
  gameDurationInSeconds: number;
  playerOneScore: number;
  playerTwoScore: number;
  gameMode: GameMode;

  constructor(gameData: GameData) {
    this.id = gameData.id;
    this.playerOneUsername = gameData.playerOneUsername;
    this.playerTwoUsername = gameData.playerTwoUsername;
    this.createdAt = gameData.createdAt;
    this.gameDurationInSeconds = gameData.gameDurationInSeconds;
    this.playerOneScore = gameData.playerOneScore;
    this.playerTwoScore = gameData.playerTwoScore;
    this.gameMode = gameData.gameMode;
  }
}
