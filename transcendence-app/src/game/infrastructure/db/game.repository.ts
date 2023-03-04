import { PaginationWithSearchQueryDto } from '../../../shared/dtos/pagination-with-search.query.dto';
import { GameWithUsers } from './game-with-users.entity';
import { Game } from './game.entity';

export abstract class IGameRepository {
  abstract addGame(game: Game): Promise<Game | null>;
  abstract getById(id: string): Promise<Game | null>;
  abstract deleteById(id: string): Promise<Game | null>;
  abstract getPaginatedGames(
    queryDto: Required<PaginationWithSearchQueryDto>,
  ): Promise<Game[] | null>;
  abstract getPaginatedUserGames(
    username: string,
    paginationDto: Required<PaginationWithSearchQueryDto>,
  ): Promise<Game[] | null>;
  abstract getPaginatedUserGamesWithUsers(
    username: string,
    paginationDto: Required<PaginationWithSearchQueryDto>,
  ): Promise<GameWithUsers[] | null>;
}
