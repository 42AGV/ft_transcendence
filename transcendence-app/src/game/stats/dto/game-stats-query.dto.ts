import { IsEnum, IsOptional } from 'class-validator';
import { GameMode } from '../../enums/game-mode.enum';

export class GameStatsQueryDto {
  @IsOptional()
  @IsEnum(GameMode)
  mode?: GameMode;
}
