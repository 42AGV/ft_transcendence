import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { IGameRepository } from './infrastructure/db/game.repository';
import { Game } from './infrastructure/db/game.entity';

@Injectable()
export class GameService {
  constructor(private gameRepository: IGameRepository) {}

  retrieveGameWithId(id: string): Promise<Game | null> {
    return this.gameRepository.getById(id);
  }
}
