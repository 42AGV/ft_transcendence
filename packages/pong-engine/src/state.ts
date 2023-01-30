import {
  getBallPos,
  getPaddlePos,
  calcInitialBallSpeed,
  movePaddleRight,
  movePaddleLeft,
  stopPaddle,
  dragPaddle,
} from './physics';
import {
  GameBall,
  GamePaddle,
  GameState,
  GamePaddleMoveCommand,
  GamePaddleDragCommand,
  GamePaddleOpponentMoveCommand,
} from './models';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  BALL_RADIUS,
} from './constants';

type EmptyPayload = object;

type Act<Type extends string, Payload extends object> = {
  type: Type;
  payload: Payload;
};

export type Action =
  | Act<'move', { deltaTime: number }>
  | Act<'addPoint', { deltaTime: number }>
  | Act<'losePoint', EmptyPayload>
  | Act<GamePaddleMoveCommand, EmptyPayload>
  | Act<GamePaddleOpponentMoveCommand, EmptyPayload>
  | Act<GamePaddleDragCommand, { dragCurrPos: number; dragPrevPos: number }>;

export const initialBallState = (): GameBall => {
  const initialBallSpeed = calcInitialBallSpeed();

  return {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    vx: initialBallSpeed.x,
    vy: initialBallSpeed.y,
    radius: BALL_RADIUS,
    color: '#FFF',
  };
};

export const initialPaddleState = (): GamePaddle => ({
  x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
  y: CANVAS_HEIGHT - 2 * PADDLE_HEIGHT,
  slide: 0,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  color: '#FFF',
});

export const initialPaddleOpponentState = (): GamePaddle => ({
  x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
  y: 0 + 2 * PADDLE_HEIGHT,
  slide: 0,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  color: '#FFF',
});

export const reducer = (
  state: GameState,
  { type, payload }: Action,
): GameState => {
  const { ball, paddle, paddleOpponent, score } = state;

  switch (type) {
    case 'move':
      return {
        ...state,
        ball: getBallPos(ball, paddle, payload.deltaTime),
        paddle: getPaddlePos(paddle, payload.deltaTime),
      };
    case 'losePoint':
      return {
        ...state,
        ball: initialBallState(),
        score: score - 1,
      };
    case 'addPoint':
      return {
        ...state,
        ball: getBallPos(ball, paddle, payload.deltaTime),
        paddle: getPaddlePos(paddle, payload.deltaTime),
        score: score + 1,
      };
    // case 'addPointMultiplayer':
    // case 'losePointMultiplayer':
    case 'paddleMoveRight':
      return {
        ...state,
        paddle: movePaddleRight(paddle),
      };
    case 'paddleMoveLeft':
      return {
        ...state,
        paddle: movePaddleLeft(paddle),
      };
    case 'paddleStop':
      return {
        ...state,
        paddle: stopPaddle(paddle),
      };
    case 'paddleDrag':
      const { dragCurrPos, dragPrevPos } = payload;
      return {
        ...state,
        paddle: dragPaddle(paddle, dragPrevPos, dragCurrPos),
      };
    case 'paddleOpponentMoveRight':
      if (paddleOpponent) {
        return {
          ...state,
          paddleOpponent: movePaddleRight(paddleOpponent),
        };
      }
    case 'paddleOpponentMoveLeft':
      if (paddleOpponent) {
        return {
          ...state,
          paddleOpponent: movePaddleLeft(paddleOpponent),
        };
      }
    case 'paddleOpponentStop':
      if (paddleOpponent) {
        return {
          ...state,
          paddleOpponent: stopPaddle(paddle),
        };
      }
    default:
      return state;
  }
};
