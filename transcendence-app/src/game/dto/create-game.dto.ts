import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { GameMode } from '../enums/game-mode.enum';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  playerOneUsername!: string;

  @IsString()
  @IsNotEmpty()
  playerTwoUsername!: string;

  @IsInt()
  @Min(1)
  gameDurationInSeconds!: number;

  @IsInt()
  @Min(0)
  playerOneScore!: number;

  @IsInt()
  @Min(0)
  playerTwoScore!: number;

  @IsEnum(GameMode)
  gameMode!: GameMode;
}
