import { GameBall, GameState } from './models';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  BALL_RADIUS,
  BRICK_WIDTH,
} from './constants';
import {
  reducer,
  initialBallState,
  initialPaddleState,
  initialPaddleOpponentState,
} from './state';

const losePointMultiplayer = (ball: GameBall) =>
  ball.y + BALL_RADIUS >= CANVAS_HEIGHT * 1.5;
const losePoint = (ball: GameBall) => ball.y > 1.5 * CANVAS_HEIGHT;

const addPointMultiplayer = (ball: GameBall) =>
  ball.y - BALL_RADIUS <= -0.5 * CANVAS_HEIGHT;
const addPoint = (ball: GameBall) =>
  ball.y <= BALL_RADIUS &&
  ball.x >= CANVAS_WIDTH / 2 - BRICK_WIDTH / 2 &&
  ball.x <= CANVAS_WIDTH / 2 + BRICK_WIDTH / 2;

// Añadir lógica para que el juego termine -> llegar a 3 puntos o llegar a -3?
export const paddleMoveRight = (state: GameState): GameState => {
  return reducer(state, { type: 'paddleMoveRight', payload: {} });
};

export const paddleOpponentMoveRight = (state: GameState): GameState => {
  return reducer(state, { type: 'paddleOpponentMoveRight', payload: {} });
};

export const paddleMoveLeft = (state: GameState): GameState => {
  return reducer(state, { type: 'paddleMoveLeft', payload: {} });
};

export const paddleOpponentMoveLeft = (state: GameState): GameState => {
  return reducer(state, { type: 'paddleOpponentMoveLeft', payload: {} });
};

export const paddleStop = (state: GameState): GameState => {
  return reducer(state, { type: 'paddleStop', payload: {} });
};

export const paddleOpponentStop = (state: GameState): GameState => {
  return reducer(state, { type: 'paddleOpponentStop', payload: {} });
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

export const paddleOpponentDrag = (
  state: GameState,
  dragCurrPos: number,
  dragPrevPos: number,
): GameState => {
  return reducer(state, {
    type: 'paddleOpponentDrag',
    payload: { dragCurrPos, dragPrevPos },
  });
};

export const paddleMoveSync = (state: GameState, newPos: number): GameState => {
  return reducer(state, {
    type: 'paddleMoveSync',
    payload: { newPos },
  });
};

export const paddleOpponentMoveSync = (
  state: GameState,
  newPos: number,
): GameState => {
  return reducer(state, {
    type: 'paddleOpponentMoveSync',
    payload: { newPos },
  });
};

export const newGame = (): GameState => ({
  ball: initialBallState(),
  paddle: initialPaddleState(),
  paddleOpponent: initialPaddleOpponentState(),
  score: 0,
  scoreOpponent: 0,
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

export const runGameMultiplayerFrame = (
  deltaTime: number,
  state: GameState,
): GameState => {
  const { ball } = state;

  if (losePointMultiplayer(ball)) {
    return reducer(state, { type: 'losePointMultiplayer', payload: {} });
  }
  if (addPointMultiplayer(ball)) {
    return reducer(state, {
      type: 'addPointMultiplayer',
      payload: {},
    });
  }
  return reducer(state, { type: 'moveMultiplayer', payload: { deltaTime } });
};
