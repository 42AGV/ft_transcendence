import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { GameId, UserId } from './infrastructure/db/memoryModels';
import { IGamesOngoingRepository } from './infrastructure/db/gamesongoing.repository';
import { IChallengesPendingRepository } from './infrastructure/db/challengespending.repository';
import {
  GameChallengeDto,
  GameChallengeResponseDto,
  gameQueueServerToClientWsEvents,
} from 'pong-engine';

// TODO: add WsExceptions
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
    return Object.values(this.gameQueue)[0][0];
  }

  private getWaitingGameId(): string | null {
    if (!this.gameQueue) return null;
    return Object.keys(this.gameQueue)[0];
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
      if (this.getWaitingUserId() === userId) {
        return null;
      }
      this.gameQueue = this.gamesOngoing.addGame(userId);
      const gameRoomId = this.getWaitingGameId();
      if (!gameRoomId) return null;
      return [gameRoomId, false];
    } else {
      // TODO: from two different tabs, or just reloading, we can get here, which is not cool
      const gameRoomId = this.getWaitingGameId();
      if (!gameRoomId) return null;
      this.gamesOngoing.addUserToGame(gameRoomId, userId);
      this.gameQueue = null;
      return [gameRoomId, true];
    }
  }

  gameQuitWaiting(userId: string): GameId | null {
    if (!this.isUserBusy(userId)) {
      return null;
    }
    if (this.gameQueue && this.getWaitingUserId() === userId) {
      const gameId = this.getWaitingGameId();
      this.gameQueue = null;
      return gameId;
    }
    if (this.challengesPending.isPlayerBusy(userId)) {
      const game = this.challengesPending.getGameRoomForPlayer(userId);
      if (!game) return null;
      const gameRoomId = Object.keys(game)[0];
      this.challengesPending.deleteGameForId(gameRoomId);
      return gameRoomId;
    }
    return null;
  }

  gameUserChallenge(
    fromUsername: string,
    fromId: UserId,
    to: UserId,
  ): GameId | null {
    if (!this.socket || this.isUserBusy(fromId) || this.isUserBusy(to)) {
      return null;
    }
    const gameRoomId = Object.keys(
      this.challengesPending.addGame(fromId, to),
    )[0];
    this.socket.to(to).emit(gameQueueServerToClientWsEvents.gameChallenge, {
      gameRoomId,
      from: {
        username: fromUsername,
        id: fromId,
      },
    } as GameChallengeDto);
    return gameRoomId;
  }

  updateChallengeStatus(
    gameChallengeResponseDto: GameChallengeResponseDto,
  ): boolean {
    const { gameRoomId } = gameChallengeResponseDto;
    const game = this.challengesPending.retrieveGameForId(gameRoomId);
    this.challengesPending.deleteGameForId(gameRoomId);
    if (!game) return false;
    const waitingPlayers = Object.values(game)[0];
    this.gamesOngoing.addGameWithId(gameRoomId, waitingPlayers);
    return true;
  }

  isThereAChallengePending(gameRoomId: GameId): boolean {
    return this.challengesPending.retrieveGameForId(gameRoomId) !== null;
  }

  removeChallengeRoom(gameRoomId: GameId): boolean {
    return this.challengesPending.deleteGameForId(gameRoomId);
  }
}
