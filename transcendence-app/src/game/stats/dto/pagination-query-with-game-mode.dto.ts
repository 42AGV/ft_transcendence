import { IsDefined, IsEnum } from 'class-validator';
import { PaginationQueryDto } from '../../../shared/dtos/pagination.query.dto';
import { GameMode } from '../../enums/game-mode.enum';

export class PaginationQueryWithGameModeDto extends PaginationQueryDto {
  @IsEnum(GameMode)
  @IsDefined()
  mode!: GameMode;
}
