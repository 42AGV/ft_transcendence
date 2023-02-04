import { Injectable, NotFoundException } from '@nestjs/common';
import { IGameRepository } from './infrastructure/db/game.repository';
import { Game } from './infrastructure/db/game.entity';
import { MAX_ENTRIES_PER_PAGE } from '../../src/shared/constants';
import { PaginationWithSearchQueryDto } from '../../src/shared/dtos/pagination-with-search.query.dto';
import { BooleanString } from '../../src/shared/enums/boolean-string.enum';
import { CreateGameDto } from './dto/create-game.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GameService {
  constructor(private gameRepository: IGameRepository) {}

  addGame(game: CreateGameDto): Promise<Game | null> {
    return this.gameRepository.add({
      id: uuidv4(),
      createdAt: new Date(Date.now()),
      ...game,
    });
  }

  async deleteGame(gameId: string) {
    const deletedGame = await this.gameRepository.deleteById(gameId);
    if (!deletedGame) {
      throw new NotFoundException();
    }
  }

  retrieveGameWithId(id: string): Promise<Game | null> {
    return this.gameRepository.getById(id);
  }

  retrieveGames({
    limit = MAX_ENTRIES_PER_PAGE,
    offset = 0,
    sort = BooleanString.False,
    search = '',
  }: PaginationWithSearchQueryDto): Promise<Game[] | null> {
    return this.gameRepository.getPaginatedGames({
      limit,
      offset,
      sort,
      search,
    });
  }
}
