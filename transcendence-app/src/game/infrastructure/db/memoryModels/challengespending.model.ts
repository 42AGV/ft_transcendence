import { GameId, UserId } from '.';
import { GameSet } from './gameset.abstract.model';
import { IChallengesPendingRepository } from '../challengespending.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChallengesPending
  extends GameSet<null>
  implements IChallengesPendingRepository
{
  constructor() {
    super();
  }

  addGame(gameId: GameId, userOneId: UserId): Record<GameId, [UserId, null]> {
    this.gameSet.set(gameId, [userOneId, null]);
    this.usersBusy.add(userOneId);
    return { [gameId]: [userOneId, null] };
  }
}
