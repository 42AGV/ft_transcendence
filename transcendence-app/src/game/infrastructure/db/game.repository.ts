import { Game } from './game.entity';

export abstract class IGameRepository {
  abstract getById(id: string): Promise<Game | null>;
  abstract deleteById(id: string): Promise<Game | null>;
  abstract updateById(
    id: string,
    updateGame: Partial<Game>,
  ): Promise<Game | null>;
  abstract add(game: Game): Promise<Game | null>;
}
