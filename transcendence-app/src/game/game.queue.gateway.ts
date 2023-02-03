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
} from 'pong-engine';
import { EventEmitter2 } from '@nestjs/event-emitter';

@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(TwoFactorAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(BadRequestTransformationFilter)
export class GameQueueGateway {
  @WebSocketServer() server!: Server;
  constructor(
    private gameQueueService: GameQueueService,
    private eventEmitter: EventEmitter2,
  ) {}

  afterInit(server: Server) {
    this.gameQueueService.socket = server;
  }

  @SubscribeMessage(gameQueueClientToServerWsEvents.gameQueueJoin)
  async gameQueueJoin(@ConnectedSocket() client: Socket): Promise<boolean> {
    const retVal = await this.gameQueueService.gameQueueJoin(
      client.request.user.id,
    );
    if (retVal) {
      const [gameRoomId, isRoomFull] = retVal;
      client.join(gameRoomId);
      if (isRoomFull) {
        this.server
          .to(gameRoomId)
          .emit(gameQueueServerToClientWsEvents.gameStatusUpdate, {
            status: GameStatus.READY,
            gameRoomId,
          } as GameStatusUpdateDto);
        this.eventEmitter.emit('game.ready', {
          status: GameStatus.READY,
          gameRoomId,
        } as GameStatusUpdateDto);
        return true;
      }
    }
    return false;
  }

  @SubscribeMessage(gameQueueClientToServerWsEvents.gameQuitWaiting)
  gameQuitWaiting(@ConnectedSocket() client: Socket): boolean {
    const gameRoomId = this.gameQueueService.gameQuitWaiting(
      client.request.user.id,
    );
    if (gameRoomId) {
      client.leave(gameRoomId);
      return true;
    }
    return false;
  }

  @SubscribeMessage(gameQueueClientToServerWsEvents.gameUserChallenge)
  gameUserChallenge(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameUserChallengeDto: GameUserChallengeDto,
  ): boolean {
    const gameRoomId = this.gameQueueService.gameUserChallenge(
      client.request.user.username,
      client.request.user.id,
      gameUserChallengeDto.to.id,
    );
    if (gameRoomId) {
      client.join(gameRoomId);
      return true;
    }
    client
      .to(client.request.user.id)
      .emit(gameQueueServerToClientWsEvents.gameStatusUpdate, {
        status: GameChallengeStatus.CHALLENGE_DECLINED,
      } as GameStatusUpdateDto);
    return false;
  }

  @SubscribeMessage(gameQueueClientToServerWsEvents.gameChallengeResponse)
  gameChallengeResponse(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameChallengeResponseDto: GameChallengeResponseDto,
  ): boolean {
    const acceptingPlayer = client.request.user.id;
    const { status, gameRoomId } = gameChallengeResponseDto;
    if (!this.gameQueueService.isThereAChallengePending(gameRoomId)) {
      client
        .to(acceptingPlayer)
        .emit(gameQueueServerToClientWsEvents.gameStatusUpdate, {
          status: GameChallengeStatus.CHALLENGE_DECLINED,
        } as GameStatusUpdateDto);
      return false;
    }
    if (status === GameChallengeStatus.CHALLENGE_ACCEPTED) {
      client.join(gameRoomId);
      client
        .to(gameRoomId)
        .emit(gameQueueServerToClientWsEvents.gameStatusUpdate, {
          status,
          gameRoomId,
        } as GameStatusUpdateDto);
      return this.gameQueueService.updateChallengeStatus(
        gameChallengeResponseDto,
        acceptingPlayer,
      );
    }
    client
      .to(gameRoomId)
      .emit(gameQueueServerToClientWsEvents.gameStatusUpdate, {
        status: GameChallengeStatus.CHALLENGE_DECLINED,
      } as GameStatusUpdateDto);
    this.server
      .in(gameRoomId)
      .fetchSockets()
      .then((matchingSockets) =>
        matchingSockets.map((socket) => socket.leave(gameRoomId)),
      );
    return false;
  }
}
