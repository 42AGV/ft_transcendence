import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GameMode } from '../enums/game-mode.enum';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  playerOneUsername!: string;

  @IsString()
  @IsNotEmpty()
  playerTwoUsername!: string;

  @IsInt()
  @IsNotEmpty()
  gameDurationInSeconds!: number;

  @IsInt()
  @IsNotEmpty()
  playerOneScore!: number;

  @IsInt()
  @IsNotEmpty()
  playerTwoScore!: number;

  @IsEnum(GameMode)
  @IsNotEmpty()
  gameMode!: GameMode;
}
