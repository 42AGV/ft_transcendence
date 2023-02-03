import { GameId, UserId } from '.';
import { GameSet } from './gameset.abstract.model';
import { IGamesOngoingRepository } from '../gamesongoing.repository';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GamesOngoing
  extends GameSet<UserId>
  implements IGamesOngoingRepository
{
  constructor() {
    super();
  }

  addGame(
    userOneId: UserId,
    userTwoId: UserId,
  ): Record<GameId, [UserId, UserId]> {
    const gameId: GameId = uuidv4();
    let ret: Record<GameId, [UserId, UserId]>;
    if (userOneId > userTwoId) {
      ret = { [gameId]: [userTwoId, userOneId] };
      this.gameSet.set(gameId, [userTwoId, userOneId]);
    } else {
      ret = { [gameId]: [userOneId, userTwoId] };
      this.gameSet.set(gameId, [userOneId, userTwoId]);
    }
    this.usersBusy.add(userOneId);
    this.usersBusy.add(userTwoId);
    return ret;
  }
}
