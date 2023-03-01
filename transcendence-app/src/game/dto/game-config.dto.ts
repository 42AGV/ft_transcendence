import { IsUUID } from 'class-validator';
import { IsGameMode } from '../validators';

export class GameConfigDto {
  @IsGameMode()
  gameMode!: string;

  @IsUUID()
  gameRoomId!: string;
}
