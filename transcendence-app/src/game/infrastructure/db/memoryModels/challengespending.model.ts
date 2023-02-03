import { GameId, UserId } from '.';
import { GameSet } from './gameset.abstract.model';
import { IChallengesPendingRepository } from '../challengespending.repository';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChallengesPending
  extends GameSet<UserId>
  implements IChallengesPendingRepository
{
  constructor() {
    super();
  }

  addGame(
    userOneId: UserId,
    userTwoId: UserId,
  ): Record<GameId, [UserId, UserId]> {
    const gameId: GameId = uuidv4();
    this.gameSet.set(gameId, [userOneId, userTwoId]);
    this.usersBusy.add(userOneId);
    this.usersBusy.add(userTwoId);
    return { [gameId]: [userOneId, userTwoId] };
  }
}
