import * as React from 'react';

import { GameBall, GamePaddle, GameState, Coord } from './models';
import { getBallPos, getPaddlePos } from './physics';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_SLIDE_SPEED,
  BALL_RADIUS,
  BALL_SPEED,
} from './constants';

type Act<Type extends string, Payload extends {}> = {
  type: Type;
  payload: Payload;
};

type Action =
  | Act<'move', { deltaTime: number }>
  | Act<
      | 'lose'
      | 'win'
      | 'paddleMoveRight'
      | 'paddleMoveLeft'
      | 'paddleStop'
      | 'dragPaddle',
      {}
    >;

const calcInitialBallSpeed = (): Coord => {
  const coef = Math.ceil(3 * Math.random());
  const angle = (Math.PI / 2) * coef + Math.PI / 4;

  return {
    x: BALL_SPEED * Math.cos(angle),
    y: BALL_SPEED * Math.sin(angle),
  };
};

const initialBallState = (): GameBall => {
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

const initialPaddleState = (): GamePaddle => ({
  x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
  y: CANVAS_HEIGHT - 2 * PADDLE_HEIGHT,
  slide: 0,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  color: '#FFF',
});

const reducer = (state: GameState, { type, payload }: Action): GameState => {
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
    // case 'paddleDrag':
    default:
      return state;
  }
};

export const UseGameState = () => {
  const gameStateRef = React.useRef<GameState>({
    ball: initialBallState(),
    paddle: initialPaddleState(),
    score: 0,
  });

  const dispatch = React.useCallback((action: Action) => {
    gameStateRef.current = reducer(gameStateRef.current, action);
  }, []);

  return { gameStateRef, dispatch };
};
