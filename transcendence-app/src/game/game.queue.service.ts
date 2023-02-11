import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Server } from 'socket.io';
import { GameId, UserId } from './infrastructure/db/memoryModels';
import { IChallengesPendingRepository } from './infrastructure/db/challenges-pending.repository';
import {
  GameChallengeDto,
  GameChallengeResponseDto,
  GameChallengeStatus,
  GameStatusUpdateDto,
  gameQueueServerToClientWsEvents,
} from 'pong-engine';
import {
  GamePairingStatusDto,
  GameQueueStatus,
} from './dto/game-pairing-status.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { WsException } from '@nestjs/websockets';
import { GamePairing } from './infrastructure/db/game-pairing.entity';
import { GameService } from './game.service';
import { v4 as uuid } from 'uuid';

type QueuedUser = {
  gameRoomId: GameId;
  userId: UserId;
};

@Injectable()
export class GameQueueService {
  public socket: Server | null = null;
  private gameQueue: QueuedUser | null = null;

  constructor(
    private readonly gameService: GameService,
    private readonly challengesPending: IChallengesPendingRepository,
  ) {}

  private isUserBusy(userId: string): boolean {
    return (
      this.gameService.isPlaying(userId) ||
      this.challengesPending.isPlayerBusy(userId) ||
      this.gameQueue?.userId === userId
    );
  }

  gameQueueJoin(userId: string): GamePairing | null {
    if (!this.socket) {
      return null;
    }
    if (this.isUserBusy(userId)) {
      // Noop, we don't want to kick the player from anywhere
      // early noop in case the server does know that the user is busy
      return null;
    }
    if (!this.gameQueue) {
      const gameRoomId = uuid();
      this.gameQueue = { gameRoomId, userId };
      return { gameRoomId, userOneId: userId };
    } else {
      if (this.gameQueue.userId === userId) {
        return null;
      }
      const gameRoomId = this.gameQueue.gameRoomId;
      const userOneId = this.gameQueue.userId;
      const userTwoId = userId;
      this.gameQueue = null;
      return { gameRoomId, userOneId, userTwoId };
    }
  }

  gameQuitWaiting(userId: string): GamePairing | null {
    if (!this.isUserBusy(userId)) {
      return null;
    }
    if (this.gameQueue && this.gameQueue.userId === userId) {
      const gameRoomId = this.gameQueue.gameRoomId;
      this.gameQueue = null;
      return { gameRoomId, userOneId: userId };
    }
    if (this.challengesPending.isPlayerBusy(userId)) {
      const game = this.challengesPending.getGameRoomForPlayer(userId);
      if (!game) {
        throw new WsException(
          'User is waiting for a challenge, but there is no instance of such challenge',
        );
      }
      this.challengesPending.deleteGameForId(game.gameRoomId);
      return game;
    }
    // otherwise the user is playing, and noop
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
    const gameRoomId = this.challengesPending.addGame(fromId, to).gameRoomId;
    this.socket.to(to).emit(gameQueueServerToClientWsEvents.gameChallenge, {
      gameRoomId,
      from: {
        username: fromUsername,
        id: fromId,
      },
    } as GameChallengeDto);
    this.socket.to(fromId).emit(
      gameQueueServerToClientWsEvents.gameContextUpdate,
      new GamePairingStatusDto({
        gameRoomId: null,
        gameQueueStatus: GameQueueStatus.WAITING,
      }),
    );
    return gameRoomId;
  }

  updateChallengeStatus(
    gameChallengeResponseDto: GameChallengeResponseDto,
    challengedPlayerId: UserId,
  ): GamePairing | null {
    const { gameRoomId } = gameChallengeResponseDto;
    const game = this.challengesPending.retrieveGameForId(gameRoomId);
    this.challengesPending.deleteGameForId(gameRoomId);
    if (!game || !game.userTwoId || game.userTwoId !== challengedPlayerId)
      return null;
    return game;
  }

  isThereAChallengePending(gameRoomId: GameId): boolean {
    return this.challengesPending.retrieveGameForId(gameRoomId) !== null;
  }

  removeChallengeRoom(gameRoomId: GameId): GamePairing | null {
    return this.challengesPending.deleteGameForId(gameRoomId);
  }

  getPairingStatus(userId: UserId): GamePairingStatusDto {
    const gameRoomId = this.gameService.getGameId(userId);
    const isPlaying = gameRoomId !== null;
    const isWaitingToPlay =
      this.gameQueue?.userId === userId ||
      this.challengesPending.isPlayerBusy(userId);
    if (isWaitingToPlay && isPlaying) {
      // TODO: remove this exception when we can prove that this will not happen
      throw new InternalServerErrorException(
        'A user is simultaneously playing and waiting to play. This should not happen',
      );
    }
    return new GamePairingStatusDto({
      gameRoomId,
      gameQueueStatus: isPlaying
        ? GameQueueStatus.PLAYING
        : isWaitingToPlay
        ? GameQueueStatus.WAITING
        : GameQueueStatus.NONE,
    });
  }

  @OnEvent('socket.userDisconnect')
  async handleUserDisconnect(user: { id: string }) {
    if (!this.socket) return;
    const maybeWaitingGame = this.gameQuitWaiting(user.id);
    if (maybeWaitingGame) {
      if (user.id !== maybeWaitingGame.userOneId) {
        this.socket
          .to(maybeWaitingGame.userOneId)
          .emit(gameQueueServerToClientWsEvents.gameStatusUpdate, {
            status: GameChallengeStatus.CHALLENGE_DECLINED,
          } as GameStatusUpdateDto);
      }
      if (maybeWaitingGame.userTwoId && user.id !== maybeWaitingGame.userTwoId)
        this.socket
          .to(maybeWaitingGame.userTwoId)
          .emit(gameQueueServerToClientWsEvents.gameStatusUpdate, {
            status: GameChallengeStatus.CHALLENGE_DECLINED,
          } as GameStatusUpdateDto);
    }
  }
}
