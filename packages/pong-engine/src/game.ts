import { GameBall, GameState } from './models';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  BALL_RADIUS,
  BRICK_WIDTH,
} from './constants';
import { Action } from './state';

const losePoint = (ball: GameBall) => ball.y > 1.5 * CANVAS_HEIGHT;

const addPoint = (ball: GameBall) =>
  ball.y <= BALL_RADIUS &&
  ball.x >= CANVAS_WIDTH / 2 - BRICK_WIDTH / 2 &&
  ball.x <= CANVAS_WIDTH / 2 + BRICK_WIDTH / 2;

// Añadir lógica para que el juego termine -> llegar a 3 puntos o llegar a -3?
export const runGameFrame = (deltaTime: number, state: GameState): Action => {
  const { ball } = state;

  if (losePoint(ball)) {
    return { type: 'losePoint', payload: {} };
  }
  if (addPoint(ball)) {
    return { type: 'addPoint', payload: { deltaTime } };
  }
  return { type: 'move', payload: { deltaTime } };
};
