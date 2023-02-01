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
  runGameMultiplayerFrame,
  newGame,
  paddleOpponentMoveRight,
  paddleOpponentMoveLeft,
  paddleOpponentStop,
} from 'pong-engine';

type GameId = string;
const FPS = 30;
const DELTA_TIME = 1 / FPS;

type GameMatch = {
  playerOneId?: string;
  playerTwoId?: string;
};

type GameInfo = {
  state: GameState;
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
      const gameState = runGameMultiplayerFrame(DELTA_TIME, gameInfo.state);
      this.games.set(gameId, { ...gameInfo, state: gameState });
      // Send game update
      this.server.to(gameId).emit('updateGame', gameInfo);
    });
  }

  @SubscribeMessage('joinGame')
  handleGameJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody('gameRoomId', ParseUUIDPipe) gameRoomId: string,
  ) {
    const userId = client.request.user.id;
    client.join(gameRoomId);

    // Check if the client want to join an existing game
    const game = this.games.get(gameRoomId);
    if (game) {
      return;
    }

    const gameMatch = this.gamesMatch.get(gameRoomId);
    const playerOneId = gameMatch && gameMatch.playerOneId;

    // Check if there is a game match for this gameId
    // Add the user as player two and create the game
    if (gameMatch && playerOneId && playerOneId !== userId) {
      const gameState = newGame();
      this.games.set(gameRoomId, {
        state: gameState,
        playerOneId,
        playerTwoId: userId,
      });
      this.server.to(gameRoomId).emit('joinGame', { res: 'ok' });
      if (!this.intervalId) {
        // buscar una mejor manera de hacer esto -> instanciar un gameRunner?
        this.intervalId = setInterval(() => {
          this.runServerGameFrame();
        }, DELTA_TIME * 1000);
      }
      this.gamesMatch.delete(gameRoomId);
      // Create a game match for this gameId and add the user as player one
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
    client.leave(gameRoomId);

    // TODO: Think how to deal with this case when a player leaves the game
    //       Also, the players could connect from multiple browsers/devices
    if (userId === game.playerOneId || userId === game.playerTwoId) {
      this.games.delete(gameRoomId);
      if (this.games.size === 0) {
        clearInterval(this.intervalId);
        this.intervalId = undefined;
      }
      this.server.to(gameRoomId).emit('leaveGame', { res: 'ok' });
      this.server.socketsLeave(gameRoomId);
    }
  }

  @SubscribeMessage('gameCommand')
  handleGameMessage(
    @MessageBody() gameInputDto: GameInputDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId: string = client.request.user.id;
    const { command, gameRoomId } = gameInputDto;
    const gameInfo = this.games.get(gameRoomId);

    if (gameInfo) {
      const isPlayerOne = userId === gameInfo.playerOneId;
      const isPlayerTwo = userId === gameInfo.playerTwoId;
      if (!isPlayerOne && !isPlayerTwo) {
        return;
      }
      if (isPlayerOne) {
        if (command === 'paddleMoveRight') {
          this.games.set(gameRoomId, {
            ...gameInfo,
            state: paddleMoveRight(gameInfo.state),
          });
        } else if (command === 'paddleMoveLeft') {
          this.games.set(gameRoomId, {
            ...gameInfo,
            state: paddleMoveLeft(gameInfo.state),
          });
        } else if (command === 'paddleStop') {
          this.games.set(gameRoomId, {
            ...gameInfo,
            state: paddleStop(gameInfo.state),
          });
        }
      } else {
        if (command === 'paddleMoveRight') {
          this.games.set(gameRoomId, {
            ...gameInfo,
            state: paddleOpponentMoveRight(gameInfo.state),
          });
        } else if (command === 'paddleMoveLeft') {
          this.games.set(gameRoomId, {
            ...gameInfo,
            state: paddleOpponentMoveLeft(gameInfo.state),
          });
        } else if (command === 'paddleStop') {
          this.games.set(gameRoomId, {
            ...gameInfo,
            state: paddleOpponentStop(gameInfo.state),
          });
        }
      }
    }
  }
}
