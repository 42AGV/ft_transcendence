import { GameId, UserId } from '.';
import { GameSet } from './gameset.abstract.model';
import { IChallengesPendingRepository } from '../challengespending.repository';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChallengesPending
  extends GameSet<null>
  implements IChallengesPendingRepository
{
  constructor() {
    super();
  }

  override addGame(userOneId: UserId): Record<GameId, [UserId, null]> {
    const gameId: GameId = uuidv4();
    this.gameSet.set(gameId, [userOneId, null]);
    this.usersBusy.add(userOneId);
    return { [gameId]: [userOneId, null] };
  }
}
