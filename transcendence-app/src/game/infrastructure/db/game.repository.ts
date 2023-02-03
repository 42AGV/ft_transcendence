import { PaginationWithSearchQueryDto } from '../../../shared/dtos/pagination-with-search.query.dto';
import { Game } from './game.entity';

export abstract class IGameRepository {
  abstract add(game: Game): Promise<Game | null>;
  abstract getById(id: string): Promise<Game | null>;
  abstract deleteById(id: string): Promise<Game | null>;
  abstract getPaginatedGames(
    queryDto: Required<PaginationWithSearchQueryDto>,
  ): Promise<Game[] | null>;
}
