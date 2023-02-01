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

export const reducer = (
  state: GameState,
  { type, payload }: Action,
): GameState => {
  const { ball, paddle, score } = state;

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
    default:
      return state;
  }
};
