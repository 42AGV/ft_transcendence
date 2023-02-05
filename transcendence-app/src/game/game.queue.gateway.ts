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
} from 'pong-engine';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SocketService } from '../socket/socket.service';

@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(TwoFactorAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(BadRequestTransformationFilter)
export class GameQueueGateway {
  @WebSocketServer() server!: Server;
  constructor(
    private gameQueueService: GameQueueService,
    private eventEmitter: EventEmitter2,
    private socketService: SocketService,
  ) {}

  afterInit(server: Server) {
    this.gameQueueService.socket = server;
  }

  @SubscribeMessage(gameQueueClientToServerWsEvents.gameQueueJoin)
  gameQueueJoin(@ConnectedSocket() client: Socket): boolean {
    const retVal = this.gameQueueService.gameQueueJoin(client.request.user.id);
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
      }
      return true;
    }
    throw new WsException(
      'User already in the game queue or waiting for some challenge',
    );
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
      client.join(gameRoomId);
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
    const acceptingPlayer = client.request.user.id;
    const { status, gameRoomId } = gameChallengeResponseDto;
    if (!this.gameQueueService.isThereAChallengePending(gameRoomId)) {
      this.server
        .to(acceptingPlayer)
        .emit(gameQueueServerToClientWsEvents.gameStatusUpdate, {
          status: GameChallengeStatus.CHALLENGE_DECLINED,
        } as GameStatusUpdateDto);
      throw new WsException(
        'There is no such challenge pending. Challenger may have cancelled',
      );
    }
    if (status === GameChallengeStatus.CHALLENGE_ACCEPTED) {
      this.gameQueueService.updateChallengeStatus(gameChallengeResponseDto);
      client.join(gameRoomId);
      this.server
        .to(gameRoomId)
        .emit(gameQueueServerToClientWsEvents.gameStatusUpdate, {
          status,
          gameRoomId,
        } as GameStatusUpdateDto);
      return true;
    }
    this.gameQueueService.removeChallengeRoom(gameRoomId);
    this.server
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
