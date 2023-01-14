import { IsUUID } from 'class-validator';
import { IsGameCommand } from '../validators';

export class GameInputDto {
  @IsUUID()
  id!: string;

  @IsGameCommand()
  command!: string;
}
