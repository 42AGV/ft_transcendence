import {
  BALL_RADIUS,
  BRICK_WIDTH,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from './constants';
import { GameBall } from './models';

export const isLose = (ball: GameBall) => ball.y > 1.5 * CANVAS_HEIGHT;
export const isWin = (ball: GameBall) =>
  ball.y <= BALL_RADIUS &&
  ball.x >= CANVAS_WIDTH / 2 - BRICK_WIDTH / 2 &&
  ball.x <= CANVAS_WIDTH / 2 + BRICK_WIDTH / 2;
