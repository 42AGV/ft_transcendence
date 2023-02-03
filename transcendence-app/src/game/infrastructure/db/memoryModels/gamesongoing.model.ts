import { GameId, UserId } from '.';
import { GameSet } from './gameset.abstract.model';
import { IGamesOngoingRepository } from '../gamesongoing.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesOngoing
  extends GameSet<UserId>
  implements IGamesOngoingRepository
{
  constructor() {
    super();
  }

  addGame(
    gameId: GameId,
    userOneId: UserId,
    userTwoId: UserId,
  ): Record<GameId, [UserId, UserId]> {
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
