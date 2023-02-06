import { GameId, UserId } from '.';
import { GameSet } from './gameset-abstract.model';
import { IGamesOngoingRepository } from '../games-ongoing.repository';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { GamePairing } from '../game-pairing.entity';

@Injectable()
export class GamesOngoing extends GameSet implements IGamesOngoingRepository {
  constructor() {
    super();
  }

  addGame(userId: UserId): GamePairing {
    const gameId: GameId = uuidv4();
    this.gameSet.set(gameId, [userId, undefined]);
    this.usersBusy.add(userId);
    return new GamePairing({
      gameRoomId: gameId,
      userOneId: userId,
    });
  }

  addUserToGame(gameRoomId: GameId, userId: UserId): GamePairing | null {
    const waitingGame = this.gameSet.get(gameRoomId);
    if (waitingGame) {
      const waitingPlayer = waitingGame[0];
      this.gameSet.set(gameRoomId, [waitingPlayer, userId]);
      this.usersBusy.add(userId);
      return new GamePairing({
        gameRoomId,
        userOneId: waitingPlayer,
        userTwoId: userId,
      });
    }
    return null;
  }

  addGameWithId(gameRoomId: string, users: [string, string]): boolean {
    if (this.gameSet.has(gameRoomId)) {
      return false;
    }
    this.gameSet.set(gameRoomId, users);
    this.usersBusy.add(users[0]);
    this.usersBusy.add(users[1]);
    return true;
  }

  isPlayerPlaying(userId: UserId): boolean {
    const game = this.getGameRoomForPlayer(userId);
    if (!game) {
      return false;
    }
    return game.userTwoId !== undefined;
  }
}
