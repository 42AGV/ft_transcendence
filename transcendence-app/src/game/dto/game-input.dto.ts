import { IsGameCommand } from '../validators';

export class GameInputDto {
  @IsGameCommand()
  command!: string;
}
