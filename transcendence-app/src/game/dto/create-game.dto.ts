import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';
import { GameMode } from 'src/shared/enums/game-mode.enum';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  playerOneUsername!: string;

  @IsString()
  @IsNotEmpty()
  playerTwoUsername!: string;

  @IsNumber()
  @IsNotEmpty()
  gameDuration!: number;

  @IsNumber()
  @IsNotEmpty()
  playerOneScore!: number;

  @IsNumber()
  @IsNotEmpty()
  playerTwoScore!: number;

  @IsString()
  @IsNotEmpty()
  gameMode!: GameMode;
}
