import {
  BALL_SPEED,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  MAX_PADDLE_BOUNCE_ANGLE,
  MIN_PADDLE_BOUNCE_ANGLE,
  DELTA_TIME,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  BALL_RADIUS,
  BRICK_WIDTH,
} from './constants';
import { GameBall, GamePaddle, Coord } from './types';

const bounceOpposite = (ball: GameBall): GameBall => ({
  ...ball,
  vx: -1 * ball.vx,
  vy: -1 * ball.vx,
  x: ball.x - ball.vx * DELTA_TIME,
  y: ball.y - ball.vy * DELTA_TIME,
});

const bounceVert = (ball: GameBall): GameBall => ({
  ...ball,
  vx: -1 * ball.vx,
  x: ball.x - ball.vx * DELTA_TIME,
  y: ball.y + ball.vy * DELTA_TIME,
});

const bounceHor = (ball: GameBall): GameBall => ({
  ...ball,
  vy: -1 * ball.vy,
  x: ball.x + ball.vx * DELTA_TIME,
  y: ball.y - ball.vy * DELTA_TIME,
});

const bounceArkanoid = (ball: GameBall, paddle: GamePaddle): GameBall => {
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
    x: ball.x + newVx * DELTA_TIME,
    y: ball.y + newVy * DELTA_TIME,
  };
};

const move = (ball: GameBall): GameBall => ({
  ...ball,
  x: ball.x + ball.vx * DELTA_TIME,
  y: ball.y + ball.vy * DELTA_TIME,
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

export const getBallPos = (ball: GameBall, paddle: GamePaddle): GameBall => {
  if (cornerCollision(ball)) {
    return bounceOpposite(ball);
  } else if (vertWallCollision(ball)) {
    return bounceVert(ball);
  } else if (horWallCollision(ball)) {
    return bounceHor(ball);
  } else if (paddleCollision(ball, paddle)) {
    return bounceArkanoid(ball, paddle);
  } else {
    return move(ball);
  }
};

export const getPaddlePos = (paddle: GamePaddle): GamePaddle => {
  if (
    (paddle.x > 0 && paddle.slide < 0) ||
    (paddle.x < CANVAS_WIDTH - PADDLE_WIDTH && paddle.slide > 0)
  ) {
    return {
      ...paddle,
      x: paddle.x + paddle.slide * DELTA_TIME,
    };
  }
  return paddle;
};

export const calcInitialBallSpeed = (): Coord => {
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

export const isLose = (ball: GameBall) => ball.y > 1.5 * CANVAS_HEIGHT;

export const isWin = (ball: GameBall) =>
  ball.y <= BALL_RADIUS &&
  ball.x >= CANVAS_WIDTH / 2 - BRICK_WIDTH / 2 &&
  ball.x <= CANVAS_WIDTH / 2 + BRICK_WIDTH / 2;
