import { GameBall, GameState } from './models';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  BALL_RADIUS,
  BRICK_WIDTH,
} from './constants';
import { reducer, initialBallState, initialPaddleState } from './state';

const losePoint = (ball: GameBall) => ball.y > 1.5 * CANVAS_HEIGHT;

const addPoint = (ball: GameBall) =>
  ball.y <= BALL_RADIUS &&
  ball.x >= CANVAS_WIDTH / 2 - BRICK_WIDTH / 2 &&
  ball.x <= CANVAS_WIDTH / 2 + BRICK_WIDTH / 2;

// Añadir lógica para que el juego termine -> llegar a 3 puntos o llegar a -3?
export const paddleMoveRight = (state: GameState): GameState => {
  return reducer(state, { type: 'paddleMoveRight', payload: {} });
};

export const paddleMoveLeft = (state: GameState): GameState => {
  return reducer(state, { type: 'paddleMoveLeft', payload: {} });
};

export const paddleStop = (state: GameState): GameState => {
  return reducer(state, { type: 'paddleStop', payload: {} });
};

export const paddleDrag = (
  state: GameState,
  dragCurrPos: number,
  dragPrevPos: number,
): GameState => {
  return reducer(state, {
    type: 'paddleDrag',
    payload: { dragCurrPos, dragPrevPos },
  });
};

export const newGame = (): GameState => ({
  ball: initialBallState(),
  paddle: initialPaddleState(),
  score: 0,
});

export const runGameFrame = (
  deltaTime: number,
  state: GameState,
): GameState => {
  const { ball } = state;

  if (losePoint(ball)) {
    return reducer(state, { type: 'losePoint', payload: {} });
  }
  if (addPoint(ball)) {
    return reducer(state, { type: 'addPoint', payload: { deltaTime } });
  }
  return reducer(state, { type: 'move', payload: { deltaTime } });
};
