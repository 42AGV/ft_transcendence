import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { GameId, UserId } from './infrastructure/db/memoryModels';
import { IGamesOngoingRepository } from './infrastructure/db/gamesongoing.repository';
import { IChallengesPendingRepository } from './infrastructure/db/challengespending.repository';
import {
  GameChallengeDto,
  GameChallengeResponseDto,
  GameChallengeStatus,
  gameQueueServerToClientWsEvents,
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
  private gameQueue: Record<GameId, [UserId, null]> | null = null;
  constructor(
    private gamesOngoing: IGamesOngoingRepository,
    private challengesPending: IChallengesPendingRepository,
  ) {}

  private getWaitingUserId(): string | null {
    if (!this.gameQueue) return null;
    const {
      key: [userA, _],
    } = this.gameQueue;
    return userA;
  }

  private getWaitingGameId(): string | null {
    if (!this.gameQueue) return null;
    const [gameId, _] = this.gameQueue.keys;
    return gameId;
  }

  private isUserBusy(userId: string): boolean {
    return (
      this.gamesOngoing.isPlayerBusy(userId) ||
      this.challengesPending.isPlayerBusy(userId) ||
      this.getWaitingUserId() === userId
    );
  }

  async gameQueueJoin(userId: string): Promise<[string, boolean] | null> {
    if (!this.socket) {
      return null;
    }
    if (this.isUserBusy(userId)) {
      // Noop, we don't want to kick the player from anywhere
      // early noop in case the server does know that the user is busy
      return null;
    }
    if (!this.gameQueue) {
      this.gameQueue = this.gamesOngoing.addGame(userId);
      const gameRoomId = this.getWaitingGameId();
      return [gameRoomId!, false];
    } else {
      // TODO: from two different tabs, or just reloading, we can get here, which is not cool
      const gameRoomId = this.getWaitingGameId();
      const game = this.gamesOngoing.addUserToGame(gameRoomId!, userId);
      this.gameQueue = null;
      return [gameRoomId!, true];
    }
  }

  gameQuitWaiting(userId: string): boolean {
    if (!this.isUserBusy(userId)) {
      return false;
    }
    if (this.gameQueue && this.getWaitingUserId() === userId) {
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

  gameUserChallenge(fromUsername: string, fromId: UserId, to: UserId): boolean {
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

  updateChallengeStatus(
    gameChallengeResponseDto: GameChallengeResponseDto,
    acceptingPlayer: UserId,
  ): boolean {
    const { status, gameRoomId } = gameChallengeResponseDto;
    if (status === GameChallengeStatus.CHALLENGE_ACCEPTED) {
      const game = this.challengesPending.retrieveGameForId(gameRoomId);
      this.challengesPending.deleteGameForId(gameRoomId);
      if (!game) return false;
      const {
        key: [waitingPlayer, _],
      } = game;
      this.gamesOngoing.addGameWithId(gameRoomId, [
        waitingPlayer,
        acceptingPlayer,
      ]);
    }
    return false;
  }
}
