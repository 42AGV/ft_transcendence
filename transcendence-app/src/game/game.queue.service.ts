import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Server } from 'socket.io';
import { GameId, UserId } from './infrastructure/db/memoryModels';
import { IGamesOngoingRepository } from './infrastructure/db/games-ongoing.repository';
import { IChallengesPendingRepository } from './infrastructure/db/challenges-pending.repository';
import {
  GameChallengeDto,
  GameChallengeResponseDto,
  GameChallengeStatus,
  gameQueueServerToClientWsEvents,
  GameStatus,
  GameStatusUpdateDto,
} from 'pong-engine';
import {
  GamePairingStatusDto,
  GameQueueStatus,
} from './dto/game-pairing-status.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { WsException } from '@nestjs/websockets';
import { GamePairing } from './infrastructure/db/game-pairing.entity';

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

  private isUserBusy(userId: string): boolean {
    return (
      this.gamesOngoing.isPlayerBusy(userId) ||
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
      const game = this.gamesOngoing.addGame(userId);
      this.gameQueue = { gameRoomId: game.gameRoomId, userId };
      return game;
    } else {
      if (this.gameQueue.userId === userId) {
        return null;
      }
      const gameRoomId = this.gameQueue.gameRoomId;
      const game = this.gamesOngoing.addUserToGame(gameRoomId, userId);
      this.gameQueue = null;
      return game;
    }
  }

  gameQuitWaiting(userId: string): GamePairing | null {
    if (!this.isUserBusy(userId)) {
      return null;
    }
    if (this.gameQueue && this.gameQueue.userId === userId) {
      const game = this.gamesOngoing.getGameRoomForPlayer(userId);
      if (
        !game ||
        game.gameRoomId !== this.gameQueue.gameRoomId ||
        game.userTwoId !== undefined
      ) {
        throw new WsException(
          "User is in the queue, but the game they've joined is not the " +
            'game that is waiting, or there is a second player in a waiting game',
        );
      }
      this.gamesOngoing.deleteGameForId(game.gameRoomId);
      this.gameQueue = null;
      return game;
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

  gameQuitPlaying(userId: string): GamePairing | null {
    if (!this.gamesOngoing.isPlayerPlaying(userId)) {
      // the user is waiting: noop
      return null;
    }
    const game = this.gamesOngoing.getGameRoomForPlayer(userId);
    if (!game || game.userTwoId === undefined) {
      throw new WsException(
        "User is playing but gameRoom they're leaving is not in correct state",
      );
    }
    this.gamesOngoing.deleteGameForId(game.gameRoomId);
    return game;
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
    this.gamesOngoing.addGameWithId(gameRoomId, [
      game.userOneId,
      game.userTwoId,
    ]);
    return game;
  }

  isThereAChallengePending(gameRoomId: GameId): boolean {
    return this.challengesPending.retrieveGameForId(gameRoomId) !== null;
  }

  removeChallengeRoom(gameRoomId: GameId): GamePairing | null {
    return this.challengesPending.deleteGameForId(gameRoomId);
  }

  getPairingStatus(userId: UserId): GamePairingStatusDto {
    const isPlaying = this.gamesOngoing.isPlayerPlaying(userId);
    const gameRoom = this.gamesOngoing.getGameRoomForPlayer(userId);
    const isWaitingToPlay =
      this.gameQueue?.userId === userId ||
      this.challengesPending.isPlayerBusy(userId);
    if (isWaitingToPlay && isPlaying) {
      // TODO: remove this exception when we can prove that this will not happen
      throw new InternalServerErrorException(
        'A user is simultaneously playing and waiting to play. This should not happen',
      );
    }
    let gameRoomId: string | null = null;
    if (gameRoom && isPlaying) {
      gameRoomId = gameRoom.gameRoomId;
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
    // TODO: do something useful here. For now it's just not leaking resources
    if (maybeWaitingGame) {
      if (user.id !== maybeWaitingGame.userOneId) {
        this.socket
          .to(maybeWaitingGame.userOneId)
          .emit(gameQueueServerToClientWsEvents.gameStatusUpdate, {
            status: GameChallengeStatus.CHALLENGE_DECLINED,
          } as GameStatusUpdateDto);
      }
      if (
        maybeWaitingGame.userTwoId &&
        user.id !== maybeWaitingGame.userTwoId
      ) {
        this.socket
          .to(maybeWaitingGame.userTwoId)
          .emit(gameQueueServerToClientWsEvents.gameStatusUpdate, {
            status: GameChallengeStatus.CHALLENGE_DECLINED,
          } as GameStatusUpdateDto);
      }
      this.socket.socketsLeave(maybeWaitingGame.gameRoomId);
    }
    const game = this.gamesOngoing.getGameRoomForPlayer(user.id);
    if (game) {
      if (user.id !== game.userOneId) {
        this.socket
          .to(game.userOneId)
          .emit(gameQueueServerToClientWsEvents.gameStatusUpdate, {
            status: GameStatus.FINISHED,
          } as GameStatusUpdateDto);
      }
      if (game.userTwoId && user.id !== game.userTwoId) {
        this.socket
          .to(game.userTwoId)
          .emit(gameQueueServerToClientWsEvents.gameStatusUpdate, {
            status: GameStatus.FINISHED,
          } as GameStatusUpdateDto);
      }
      this.socket.socketsLeave(game.gameRoomId);
    }
  }
}
