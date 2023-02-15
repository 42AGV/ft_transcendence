import { IsNumber, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { IsGameCommand } from '../validators';

class DragPayload {
  @IsNumber()
  dragCurrPos!: number;

  @IsNumber()
  dragPrevPos!: number;
}

export class GameInputDto {
  @IsGameCommand()
  command!: string;

  @IsUUID()
  gameRoomId!: string;

  @IsOptional()
  @ValidateNested()
  payload?: DragPayload;
}
