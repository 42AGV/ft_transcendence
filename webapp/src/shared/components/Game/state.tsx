import { getBallPos, getPaddlePos } from './physics';
import { GameBall, GamePaddle, Coord } from './models';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_SLIDE_SPEED,
  BALL_RADIUS,
  BALL_SPEED,
} from './constants';

export type GameState = {
  ball: GameBall;
  paddle: GamePaddle;
  score: number;
};

type Act<Type extends string, Payload extends {}> = {
  type: Type;
  payload: Payload;
};

export type Action =
  | Act<'move', { deltaTime: number }>
  | Act<
      'lose' | 'win' | 'paddleMoveRight' | 'paddleMoveLeft' | 'paddleStop',
      {}
    >
  | Act<'paddleDrag', { dragCurrPos: number; dragPrevPos: number }>;

const getPaddleDragX = (
  paddle: GamePaddle,
  dragPrevPos: number,
  dragCurrPos: number,
): number => {
  const deltaX = paddle.x - (dragPrevPos - dragCurrPos);

  if (deltaX < 0) {
    return 0;
  } else if (deltaX > CANVAS_WIDTH - PADDLE_WIDTH) {
    return CANVAS_WIDTH - PADDLE_WIDTH;
  }
  return deltaX;
};

const calcInitialBallSpeed = (): Coord => {
  const coef = Math.ceil(3 * Math.random());
  const angle = (Math.PI / 2) * coef + Math.PI / 4;

  return {
    x: BALL_SPEED * Math.cos(angle),
    y: BALL_SPEED * Math.sin(angle),
  };
};

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
  const ball = state.ball;
  const paddle = state.paddle;
  const score = state.score;

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
        paddle: {
          ...paddle,
          slide: PADDLE_SLIDE_SPEED,
        },
      };
    case 'paddleMoveLeft':
      return {
        ...state,
        paddle: {
          ...paddle,
          slide: -1 * PADDLE_SLIDE_SPEED,
        },
      };
    case 'paddleStop':
      return {
        ...state,
        paddle: {
          ...paddle,
          slide: 0,
        },
      };
    case 'paddleDrag':
      const { dragCurrPos, dragPrevPos } = payload;
      return {
        ...state,
        paddle: {
          ...paddle,
          x: getPaddleDragX(paddle, dragPrevPos, dragCurrPos),
        },
      };
    default:
      return state;
  }
};
