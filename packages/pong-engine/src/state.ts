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

type Act<Type extends string, Payload extends {}> = {
  type: Type;
  payload: Payload;
};

export type Action =
  | Act<'move', { deltaTime: number }>
  | Act<'lose' | 'win' | GamePaddleMoveCommand, {}>
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
      const { deltaTime } = payload;
      return {
        ...state,
        ball: getBallPos(ball, paddle, deltaTime),
        paddle: getPaddlePos(paddle, deltaTime),
      };
    case 'lose':
      return {
        ...state,
        ball: initialBallState(),
        score: score - 1,
      };
    case 'win':
      return {
        ...state,
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
