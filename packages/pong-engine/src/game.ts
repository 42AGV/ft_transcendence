import { GameBall, GameState } from './models';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  BALL_RADIUS,
  BRICK_WIDTH,
} from './constants';
import { Action } from './state';

const isLose = (ball: GameBall) => ball.y > 1.5 * CANVAS_HEIGHT;

const isWin = (ball: GameBall) =>
  ball.y <= BALL_RADIUS &&
  ball.x >= CANVAS_WIDTH / 2 - BRICK_WIDTH / 2 &&
  ball.x <= CANVAS_WIDTH / 2 + BRICK_WIDTH / 2;

export const runGameFrame = (deltaTime: number, state: GameState): Action => {
  const { ball } = state;

  if (isLose(ball)) {
    return { type: 'lose', payload: {} };
  }
  if (isWin(ball)) {
    return { type: 'win', payload: { deltaTime } };
  }
  return { type: 'move', payload: { deltaTime } };
};
