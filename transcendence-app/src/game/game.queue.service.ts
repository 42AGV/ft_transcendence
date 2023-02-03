import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UserId } from './infrastructure/db/memoryModels';
import { IGamesOngoingRepository } from './infrastructure/db/gamesongoing.repository';
import { IChallengesPendingRepository } from './infrastructure/db/challengespending.repository';
import {
  GameChallengeDto,
  gameQueueServerToClientWsEvents
} from 'pong-engine';

interface GameReadyData {
  accepted: boolean;
  gameRoomId: string;
}

export class GameReady {
  accepted: boolean;
  gameRoomId: string;

  constructor({ accepted, gameRoomId }: GameReadyData) {
    this.accepted = accepted;
    this.gameRoomId = gameRoomId;
  }
}

@Injectable()
export class GameQueueService {
  public socket: Server | null = null;
  private gameQueue: [UserId, Socket] | null = null;
  constructor(
    private gamesOngoing: IGamesOngoingRepository,
    private challengesPending: IChallengesPendingRepository,
  ) {}

  private isUserBusy(userId: string): boolean {
    return (
      this.gamesOngoing.isPlayerBusy(userId) ||
      this.challengesPending.isPlayerBusy(userId) ||
      ((this.gameQueue && this.gameQueue[0] === userId) ?? false)
    );
  }

  async gameQueueJoin(
    client: Socket,
    userId: string,
  ): Promise<[string, Socket] | null> {
    if (!this.socket) {
      return null;
    }
    if (this.isUserBusy(userId)) {
      // Noop, we don't want to kick the player from anywhere
      // early noop in case the server does know that the user is busy
      return null;
    }
    if (!this.gameQueue) {
      this.gameQueue = [userId, client];
      return null;
    } else {
      // TODO: from two different tabs, or just reloading, we can get here, which is not cool
      const [gameRoomId, _] = this.gamesOngoing.addGame(
        this.gameQueue[0],
        userId,
      ).key;
      const waitingClient = this.gameQueue[1];
      this.gameQueue = null;
      return [gameRoomId, waitingClient];
    }
  }

  gameQuitWaiting(userId: string): boolean {
    if (!this.isUserBusy(userId)) {
      return false;
    }
    if (this.gameQueue && this.gameQueue[0] === userId) {
      this.gameQueue = null;
      return true;
    }
    if (this.challengesPending.isPlayerBusy(userId)) {
      const [gameRoomId, _] =
        this.challengesPending.getGameRoomForPlayer(userId)!.keys;
      return this.challengesPending.deleteGameForId(gameRoomId);
    } else {
      // the user must be playing, so noop
      return false;
    }
  }

  gameUserChallenge(
    client: Socket,
    fromUsername: string,
    fromId: UserId,
    to: UserId,
  ): boolean {
    if (!this.socket || this.isUserBusy(fromId) || this.isUserBusy(to)) {
      return false;
    }
    const [gameRoomId, _] = this.challengesPending.addGame(fromId).keys;
    this.socket.to(to).emit(gameQueueServerToClientWsEvents.gameChallenge, {
      gameRoomId,
      from: {
        username: fromUsername,
        id: fromId,
      },
    } as GameChallengeDto);
    return true;
  }
}
