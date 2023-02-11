import { IsUUID } from 'class-validator';
import { IsGameCommand } from '../validators';

export class GameInputDto {
  @IsGameCommand()
  command!: string;

  @IsUUID()
  gameRoomId!: string;
}
