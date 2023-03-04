import { IsEnum, IsInt, IsString, IsUUID } from 'class-validator';
import { GameMode } from '../enums/game-mode.enum';
import { User } from '../../user/infrastructure/db/user.entity';

export class GameWithUsers {
  id!: string;
  playerOneUsername!: string;
  playerTwoUsername!: string;
  createdAt!: Date;
  gameDurationInSeconds!: number;
  playerOneScore!: number;
  playerTwoScore!: number;
  gameMode!: GameMode;
  playerOne!: User;
  playerTwo!: User;

  constructor({
    id,
    playerOneUsername,
    playerTwoUsername,
    playerOne,
    playerTwo,
    gameDurationInSeconds,
    playerOneScore,
    playerTwoScore,
    gameMode,
  }: GameWithUsers) {
    this.id = id;
    this.playerOneUsername = playerOneUsername;
    this.playerTwoUsername = playerTwoUsername;
    this.gameDurationInSeconds = gameDurationInSeconds;
    this.playerOneScore = playerOneScore;
    this.playerTwoScore = playerTwoScore;
    this.gameMode = gameMode;
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
  }
}
