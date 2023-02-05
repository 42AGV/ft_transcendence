import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { GameId, UserId } from './infrastructure/db/memoryModels';
import { IGamesOngoingRepository } from './infrastructure/db/games-ongoing.repository';
import { IChallengesPendingRepository } from './infrastructure/db/challenges-pending.repository';
import {
  GameChallengeDto,
  GameChallengeResponseDto,
  gameQueueServerToClientWsEvents,
} from 'pong-engine';
import { GamePairingStatusDto } from './dto/game.pairing.status.dto';

type QueuedUser = {
  gameRoomId: GameId;
  userId: UserId;
};

@Injectable()
export class GameQueueService {
  public socket: Server | null = null;
  private gameQueue: QueuedUser | null = null;
  constructor(
    private gamesOngoing: IGamesOngoingRepository,
    private challengesPending: IChallengesPendingRepository,
  ) {}

  private getWaitingUserId(): string | null {
    if (!this.gameQueue) return null;
    return this.gameQueue.userId;
  }

  private getWaitingGameId(): string | null {
    if (!this.gameQueue) return null;
    return this.gameQueue.gameRoomId;
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
      const gameRoomId = Object.keys(this.gamesOngoing.addGame(userId))[0];
      this.gameQueue = { gameRoomId, userId };
      return [gameRoomId, false];
    } else {
      if (this.getWaitingUserId() === userId) {
        return null;
      }
      const gameRoomId = this.gameQueue.gameRoomId;
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
      const game = this.gamesOngoing.getGameRoomForPlayer(userId);
      if (!game) return null;
      const gameRoomId = Object.keys(game)[0];
      this.gamesOngoing.deleteGameForId(gameRoomId);
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

  getPairingStatus(userId: UserId): GamePairingStatusDto {
    const isPlaying = this.gamesOngoing.isPlayerPlaying(userId);
    const gameRoom = this.gamesOngoing.getGameRoomForPlayer(userId);
    let gameRoomId: string | null = null;
    if (gameRoom && isPlaying) {
      gameRoomId = Object.keys(gameRoom)[0];
    }
    return new GamePairingStatusDto({
      isPlaying,
      isWaitingToPlay:
        this.getWaitingUserId() === userId ||
        this.challengesPending.isPlayerBusy(userId),
      gameRoomId,
    });
  }
}
