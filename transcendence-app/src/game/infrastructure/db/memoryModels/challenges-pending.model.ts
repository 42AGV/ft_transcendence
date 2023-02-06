import { GameId, UserId } from '.';
import { GameSet } from './gameset-abstract.model';
import { IChallengesPendingRepository } from '../challenges-pending.repository';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { GamePairing } from '../game-pairing.entity';

@Injectable()
export class ChallengesPending
  extends GameSet
  implements IChallengesPendingRepository
{
  constructor() {
    super();
  }

  addGame(userOneId: UserId, userTwoId: UserId): GamePairing {
    const gameRoomId: GameId = uuidv4();
    this.gameSet.set(gameRoomId, [userOneId, userTwoId]);
    this.usersBusy.add(userOneId);
    this.usersBusy.add(userTwoId);
    return new GamePairing({
      gameRoomId,
      userOneId,
      userTwoId,
    });
  }
}
