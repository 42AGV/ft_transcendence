import {
  ClassSerializerInterceptor,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BadRequestTransformationFilter } from '../shared/filters/bad-request-transformation.filter';
import { TwoFactorAuthenticatedGuard } from '../shared/guards/two-factor-authenticated.guard';
import { GameQueueService } from './game.queue.service';
import {
  GameChallengeResponseDto,
  GameChallengeStatus,
  gameQueueClientToServerWsEvents,
  gameQueueServerToClientWsEvents,
  GameStatus,
  GameStatusUpdateDto,
  GameUserChallengeDto,
} from 'transcendence-shared';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SocketService } from '../socket/socket.service';
import {
  GamePairingStatusDto,
  GameQueueStatus,
} from './dto/game-pairing-status.dto';

@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(TwoFactorAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(BadRequestTransformationFilter)
export class GameQueueGateway {
  @WebSocketServer() server!: Server;
  constructor(
    private readonly gameQueueService: GameQueueService,
    private readonly eventEmitter: EventEmitter2,
    private readonly socketService: SocketService,
  ) {}

  afterInit(server: Server) {
    this.gameQueueService.socket = server;
  }

  @SubscribeMessage(gameQueueClientToServerWsEvents.gameQueueJoin)
  gameQueueJoin(@ConnectedSocket() client: Socket): boolean {
    const game = this.gameQueueService.gameQueueJoin(client.request.user.id);
    if (game) {
      if (game.userTwoId !== undefined) {
        this.server
          .to([game.userOneId, game.userTwoId])
          .emit(gameQueueServerToClientWsEvents.gameStatusUpdate, {
            status: GameStatus.READY,
            gameRoomId: game.gameRoomId,
          } as GameStatusUpdateDto);
        this.eventEmitter.emit('game.ready', game);
      } else {
        this.server.to(client.request.user.id).emit(
          gameQueueServerToClientWsEvents.gameContextUpdate,
          new GamePairingStatusDto({
            gameRoomId: null,
            gameQueueStatus: GameQueueStatus.WAITING,
          }),
        );
      }
      return true;
    }
    throw new WsException(
      'User already in the game queue or waiting for some challenge',
    );
  }

  @SubscribeMessage(gameQueueClientToServerWsEvents.gameQuitWaiting)
  gameQuitWaiting(@ConnectedSocket() client: Socket): boolean {
    const game = this.gameQueueService.gameQuitWaiting(client.request.user.id);
    if (game) {
      this.server.to(client.request.user.id).emit(
        gameQueueServerToClientWsEvents.gameContextUpdate,
        new GamePairingStatusDto({
          gameRoomId: null,
          gameQueueStatus: GameQueueStatus.NONE,
        }),
      );
      if (game.userTwoId) {
        this.server
          .to(game.userTwoId)
          .emit(gameQueueServerToClientWsEvents.gameStatusUpdate, {
            status: GameChallengeStatus.CHALLENGE_DECLINED,
          } as GameStatusUpdateDto);
      }
      return true;
    }
    throw new WsException('User was not waiting, so cannot quit');
  }

  @SubscribeMessage(gameQueueClientToServerWsEvents.gameUserChallenge)
  gameUserChallenge(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameUserChallengeDto: GameUserChallengeDto,
  ): boolean {
    if (!this.socketService.isUserOnline(gameUserChallengeDto.to.id)) {
      this.server
        .to(client.request.user.id)
        .emit(gameQueueServerToClientWsEvents.gameStatusUpdate, {
          status: GameChallengeStatus.CHALLENGE_DECLINED,
        } as GameStatusUpdateDto);
      throw new WsException('User is not online and cannot be challenged');
    }
    const gameRoomId = this.gameQueueService.gameUserChallenge(
      client.request.user.username,
      client.request.user.id,
      gameUserChallengeDto.to.id,
    );
    if (gameRoomId) {
      return true;
    }
    this.server
      .to(client.request.user.id)
      .emit(gameQueueServerToClientWsEvents.gameStatusUpdate, {
        status: GameChallengeStatus.CHALLENGE_DECLINED,
      } as GameStatusUpdateDto);
    throw new WsException(
      'User is busy waiting in the game queue or waiting to resolve some challenge',
    );
  }

  @SubscribeMessage(gameQueueClientToServerWsEvents.gameChallengeResponse)
  gameChallengeResponse(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameChallengeResponseDto: GameChallengeResponseDto,
  ): boolean {
    const challengedPlayerId = client.request.user.id;
    const { status, gameRoomId } = gameChallengeResponseDto;
    if (!this.gameQueueService.isThereAChallengePending(gameRoomId)) {
      this.server
        .to(challengedPlayerId)
        .emit(gameQueueServerToClientWsEvents.gameStatusUpdate, {
          status: GameChallengeStatus.CHALLENGE_DECLINED,
        } as GameStatusUpdateDto);
      throw new WsException(
        'There is no such challenge pending. Challenger has cancelled',
      );
    }
    if (status === GameChallengeStatus.CHALLENGE_ACCEPTED) {
      const game = this.gameQueueService.updateChallengeStatus(
        gameChallengeResponseDto,
        challengedPlayerId,
      );
      if (game && game.userTwoId) {
        const { gameRoomId, userOneId, userTwoId } = game;
        this.server
          .to([userOneId, userTwoId])
          .emit(gameQueueServerToClientWsEvents.gameStatusUpdate, {
            status,
            gameRoomId,
          } as GameStatusUpdateDto);
        this.eventEmitter.emit('game.ready', game);
        return true;
      }
      throw new WsException(
        'There is no such challenge pending. Challenged player Id is unexpected',
      );
    }
    const game = this.gameQueueService.removeChallengeRoom(gameRoomId);
    if (!game) {
      throw new WsException(
        'There is no such challenge pending. Challenged player Id is unexpected',
      );
    }
    this.server.to(challengedPlayerId).emit(
      gameQueueServerToClientWsEvents.gameContextUpdate,
      new GamePairingStatusDto({
        gameRoomId: null,
        gameQueueStatus: GameQueueStatus.NONE,
      }),
    );
    this.server
      .to(game.userOneId)
      .emit(gameQueueServerToClientWsEvents.gameStatusUpdate, {
        status: GameChallengeStatus.CHALLENGE_DECLINED,
      } as GameStatusUpdateDto);
    return false;
  }
}
