import {
  ClassSerializerInterceptor,
  ParseUUIDPipe,
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
import { Socket, Server } from 'socket.io';
import { BadRequestTransformationFilter } from '../shared/filters/bad-request-transformation.filter';
import { TwoFactorAuthenticatedGuard } from '../shared/guards/two-factor-authenticated.guard';
import { GameInputDto } from './dto/game-input.dto';
import {
  GameState,
  paddleMoveRight,
  paddleMoveLeft,
  paddleStop,
  runGameFrame,
  newGame,
  paddleOpponentMoveRight,
  paddleOpponentMoveLeft,
  paddleOpponentStop,
} from 'pong-engine';

type GameId = string;
const FPS = 60;
const DELTA_TIME = 1 / FPS;

type GameMatch = {
  playerOneId?: string;
  playerTwoId?: string;
};

type GameInfo = {
  playerOneState: GameState;
  playerTwoState: GameState;
  playerOneId: string;
  playerTwoId: string;
};
@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(TwoFactorAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(BadRequestTransformationFilter)
export class GameGateway {
  @WebSocketServer() server!: Server;
  games = new Map<GameId, GameInfo>();
  gamesMatch = new Map<GameId, GameMatch>();
  intervalId: NodeJS.Timer | undefined = undefined;

  runServerGameFrame() {
    this.games.forEach((gameInfo: GameInfo, gameId: GameId) => {
      const playerOneState = runGameFrame(DELTA_TIME, gameInfo.playerOneState);
      const playerTwoState = runGameFrame(DELTA_TIME, gameInfo.playerTwoState);
      this.games.set(gameId, { ...gameInfo, playerOneState, playerTwoState });
    });
  }

  sendGamesUpdates() {
    this.games.forEach((gameInfo: GameInfo) => {
      this.server
        .to(gameInfo.playerOneId)
        .emit('updateGame', gameInfo.playerOneState);
      this.server
        .to(gameInfo.playerTwoId)
        .emit('updateGame', gameInfo.playerTwoState);
    });
  }

  @SubscribeMessage('joinGame')
  handleGameJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody('gameRoomId', ParseUUIDPipe) gameRoomId: string,
  ) {
    const userId = client.request.user.id;
    client.join(gameRoomId);
    const gameMatch = this.games.get(gameRoomId);
    const playerOneId = gameMatch && gameMatch.playerOneId;
    if (gameMatch && playerOneId) {
      this.games.set(gameRoomId, {
        playerOneState: newGame(),
        playerTwoState: newGame(),
        playerOneId,
        playerTwoId: userId,
      });
      this.server.to(playerOneId).to(userId).emit('joinGame', { res: 'ok' });
      if (!this.intervalId) {
        // buscar una mejor manera de hacer esto -> instanciar un gameRunner?
        this.intervalId = setInterval(() => {
          this.runServerGameFrame();
          this.sendGamesUpdates();
        }, DELTA_TIME * 1000);
      }
      this.gamesMatch.delete(gameRoomId);
    } else {
      this.gamesMatch.set(gameRoomId, { playerOneId: userId });
    }
  }

  @SubscribeMessage('leaveGame')
  handleGameLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody('gameRoomId', ParseUUIDPipe) gameRoomId: string,
  ) {
    const userId = client.request.user.id;
    const game = this.games.get(gameRoomId);
    if (!game) {
      return;
    }
    this.games.delete(gameRoomId);
    if (this.games.size === 0) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.server
      .to(game.playerOneId)
      .to(game.playerTwoId)
      .emit('leaveGame', { res: 'ok' });
    if (userId === game.playerOneId || userId === game.playerTwoId) {
      this.server.socketsLeave(gameRoomId);
    }
  }

  @SubscribeMessage('gameCommand')
  handleGameMessage(
    @MessageBody() gameInputDto: GameInputDto,
    @ConnectedSocket() client: Socket,
    @MessageBody('gameRoomId', ParseUUIDPipe) gameRoomId: string,
  ) {
    const userId: string = client.request.user.id;
    const { command } = gameInputDto;
    const gameInfo = this.games.get(gameRoomId);

    if (gameInfo) {
      const isPlayerOne = userId === gameInfo.playerOneId;
      const isPlayerTwo = userId === gameInfo.playerTwoId;
      if (!isPlayerOne || !isPlayerTwo) {
        return;
      }
      if (isPlayerOne) {
        if (command === 'paddleMoveRight') {
          this.games.set(gameRoomId, {
            ...gameInfo,
            playerOneState: paddleMoveRight(gameInfo.playerOneState),
            playerTwoState: paddleOpponentMoveRight(gameInfo.playerTwoState),
          });
        } else if (command === 'paddleMoveLeft') {
          this.games.set(gameRoomId, {
            ...gameInfo,
            playerOneState: paddleMoveLeft(gameInfo.playerOneState),
            playerTwoState: paddleOpponentMoveLeft(gameInfo.playerTwoState),
          });
        } else if (command === 'paddleStop') {
          this.games.set(gameRoomId, {
            ...gameInfo,
            playerOneState: paddleStop(gameInfo.playerOneState),
            playerTwoState: paddleOpponentStop(gameInfo.playerTwoState),
          });
        }
      } else {
        if (command === 'paddleMoveRight') {
          this.games.set(gameRoomId, {
            ...gameInfo,
            playerOneState: paddleMoveRight(gameInfo.playerTwoState),
            playerTwoState: paddleOpponentMoveRight(gameInfo.playerOneState),
          });
        } else if (command === 'paddleMoveLeft') {
          this.games.set(gameRoomId, {
            ...gameInfo,
            playerOneState: paddleMoveLeft(gameInfo.playerTwoState),
            playerTwoState: paddleOpponentMoveLeft(gameInfo.playerOneState),
          });
        } else if (command === 'paddleStop') {
          this.games.set(gameRoomId, {
            ...gameInfo,
            playerOneState: paddleStop(gameInfo.playerTwoState),
            playerTwoState: paddleOpponentStop(gameInfo.playerOneState),
          });
        }
      }
    }
  }
}
