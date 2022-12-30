import {
  BALL_SPEED,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  MAX_PADDLE_BOUNCE_ANGLE,
  MIN_PADDLE_BOUNCE_ANGLE,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  BALL_RADIUS,
  BRICK_WIDTH,
} from './constants';
import { GameBall, GamePaddle, Coord } from './types';

const bounceOpposite = (ball: GameBall, deltaTime: number): GameBall => ({
  ...ball,
  vx: -1 * ball.vx,
  vy: -1 * ball.vy,
  x: ball.x - ball.vx * deltaTime,
  y: ball.y - ball.vy * deltaTime,
});

const bounceVert = (ball: GameBall, deltaTime: number): GameBall => ({
  ...ball,
  vx: -1 * ball.vx,
  x: ball.x - ball.vx * deltaTime,
  y: ball.y + ball.vy * deltaTime,
});

const bounceHor = (ball: GameBall, deltaTime: number): GameBall => ({
  ...ball,
  vy: -1 * ball.vy,
  x: ball.x + ball.vx * deltaTime,
  y: ball.y - ball.vy * deltaTime,
});

const bounceArkanoid = (
  ball: GameBall,
  paddle: GamePaddle,
  deltaTime: number,
): GameBall => {
  const paddleBallDistance = ball.x - paddle.x;
  const bounceAngle =
    MAX_PADDLE_BOUNCE_ANGLE -
    (paddleBallDistance / PADDLE_WIDTH) *
      (MAX_PADDLE_BOUNCE_ANGLE - MIN_PADDLE_BOUNCE_ANGLE);
  const newVx = BALL_SPEED * Math.cos(bounceAngle);
  const newVy = BALL_SPEED * -1 * Math.sin(bounceAngle);

  return {
    ...ball,
    vx: newVx,
    vy: newVy,
    x: ball.x + newVx * deltaTime,
    y: ball.y + newVy * deltaTime,
  };
};

const move = (ball: GameBall, deltaTime: number): GameBall => ({
  ...ball,
  x: ball.x + ball.vx * deltaTime,
  y: ball.y + ball.vy * deltaTime,
});

const cornerCollision = (ball: GameBall) =>
  // top left corner
  (ball.x < BALL_RADIUS && ball.y < BALL_RADIUS) ||
  // top right corner
  (ball.x > CANVAS_WIDTH - BALL_RADIUS && ball.y < BALL_RADIUS);

const vertWallCollision = (ball: GameBall) =>
  ball.x <= BALL_RADIUS || ball.x >= CANVAS_WIDTH - BALL_RADIUS;

const horWallCollision = (ball: GameBall) => ball.y <= BALL_RADIUS;

const paddleCollision = (ball: GameBall, paddle: GamePaddle) =>
  ball.y > paddle.y - BALL_RADIUS &&
  ball.y < paddle.y + BALL_RADIUS &&
  ball.x > paddle.x - BALL_RADIUS &&
  ball.x < paddle.x + paddle.width + BALL_RADIUS;

const calcInitialBallSpeed = (): Coord => {
  const coef = Math.ceil(3 * Math.random());
  const angle = (Math.PI / 2) * coef + Math.PI / 4;

  return {
    x: BALL_SPEED * Math.cos(angle),
    y: BALL_SPEED * Math.sin(angle),
  };
};

export const getBallPos = (
  ball: GameBall,
  paddle: GamePaddle,
  deltaTime: number,
): GameBall => {
  if (cornerCollision(ball)) {
    return bounceOpposite(ball, deltaTime);
  } else if (vertWallCollision(ball)) {
    return bounceVert(ball, deltaTime);
  } else if (horWallCollision(ball)) {
    return bounceHor(ball, deltaTime);
  } else if (paddleCollision(ball, paddle)) {
    return bounceArkanoid(ball, paddle, deltaTime);
  } else {
    return move(ball, deltaTime);
  }
};

export const getPaddlePos = (
  paddle: GamePaddle,
  deltaTime: number,
): GamePaddle => {
  if (
    (paddle.x > 0 && paddle.slide < 0) ||
    (paddle.x < CANVAS_WIDTH - PADDLE_WIDTH && paddle.slide > 0)
  ) {
    return {
      ...paddle,
      x: paddle.x + paddle.slide * deltaTime,
    };
  }
  return paddle;
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

export const isLose = (ball: GameBall) => ball.y > 1.5 * CANVAS_HEIGHT;

export const isWin = (ball: GameBall) =>
  ball.y <= BALL_RADIUS &&
  ball.x >= CANVAS_WIDTH / 2 - BRICK_WIDTH / 2 &&
  ball.x <= CANVAS_WIDTH / 2 + BRICK_WIDTH / 2;