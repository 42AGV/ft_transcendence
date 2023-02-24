import {
  BALL_SPEED,
  CANVAS_WIDTH,
  MAX_PADDLE_BOUNCE_ANGLE,
  MIN_PADDLE_BOUNCE_ANGLE,
  MAX_PADDLE_OPPONENT_BOUNCE_ANGLE,
  MIN_PADDLE_OPPONENT_BOUNCE_ANGLE,
  PADDLE_SLIDE_SPEED,
  BALL_RADIUS,
  PADDLE_HEIGHT,
  getPaddleWidth,
} from './constants';
import { GameBall, GamePaddle, Coord } from './models';

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

const getArkanoidBounce = (
  ball: GameBall,
  bounceAngle: number,
  deltaTime: number,
): GameBall => {
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

const bounceArkanoid = (
  ball: GameBall,
  paddle: GamePaddle,
  deltaTime: number,
): GameBall => {
  const paddleBallDistance = ball.x - paddle.x;
  const bounceAngle =
    MAX_PADDLE_BOUNCE_ANGLE -
    (paddleBallDistance / getPaddleWidth(paddle.short)) *
      (MAX_PADDLE_BOUNCE_ANGLE - MIN_PADDLE_BOUNCE_ANGLE);
  return getArkanoidBounce(ball, bounceAngle, deltaTime);
};

const bounceArkanoidOpponent = (
  ball: GameBall,
  paddle: GamePaddle,
  deltaTime: number,
): GameBall => {
  const paddleBallDistance = ball.x - paddle.x;
  const bounceAngle =
    MAX_PADDLE_OPPONENT_BOUNCE_ANGLE -
    (paddleBallDistance / getPaddleWidth(paddle.short)) *
      (MAX_PADDLE_OPPONENT_BOUNCE_ANGLE - MIN_PADDLE_OPPONENT_BOUNCE_ANGLE);
  return getArkanoidBounce(ball, bounceAngle, deltaTime);
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

const paddleOpponentCollision = (ball: GameBall, paddle: GamePaddle) =>
  ball.y > paddle.y - BALL_RADIUS + PADDLE_HEIGHT &&
  ball.y < paddle.y + BALL_RADIUS + PADDLE_HEIGHT &&
  ball.x > paddle.x - BALL_RADIUS &&
  ball.x < paddle.x + paddle.width + BALL_RADIUS;

const paddleCollision = (ball: GameBall, paddle: GamePaddle) =>
  ball.y > paddle.y - BALL_RADIUS &&
  ball.y < paddle.y + BALL_RADIUS &&
  ball.x > paddle.x - BALL_RADIUS &&
  ball.x < paddle.x + paddle.width + BALL_RADIUS;

export const calcInitialBallSpeed = (): Coord => {
  const coef = Math.ceil(3 * Math.random());
  const angle = (Math.PI / 2) * coef + Math.PI / 4;

  return {
    x: BALL_SPEED * Math.cos(angle),
    y: BALL_SPEED * Math.sin(angle),
  };
};

export const getBallPosMultiplayer = (
  ball: GameBall,
  paddle: GamePaddle,
  paddleOpponent: GamePaddle,
  deltaTime: number,
): GameBall => {
  if (vertWallCollision(ball)) {
    return bounceVert(ball, deltaTime);
  } else if (paddleCollision(ball, paddle)) {
    return bounceArkanoid(ball, paddle, deltaTime);
  } else if (paddleOpponentCollision(ball, paddleOpponent)) {
    return bounceArkanoidOpponent(ball, paddleOpponent, deltaTime);
  } else {
    return move(ball, deltaTime);
  }
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
  const newPaddleX = paddle.x + paddle.slide * deltaTime;

  if (
    newPaddleX > 0 &&
    newPaddleX < CANVAS_WIDTH - getPaddleWidth(paddle.short)
  ) {
    return {
      ...paddle,
      x: newPaddleX,
    };
  }
  return paddle;
};

export const dragPaddle = (
  paddle: GamePaddle,
  dragPrevPos: number,
  dragCurrPos: number,
): GamePaddle => {
  let deltaX = paddle.x - (dragPrevPos - dragCurrPos);

  if (deltaX < 0) {
    deltaX = 0;
  } else if (deltaX > CANVAS_WIDTH - getPaddleWidth(paddle.short)) {
    deltaX = CANVAS_WIDTH - getPaddleWidth(paddle.short);
  }

  return {
    ...paddle,
    x: deltaX,
  };
};

export const movePaddleRight = (paddle: GamePaddle): GamePaddle => {
  return {
    ...paddle,
    slide: PADDLE_SLIDE_SPEED,
  };
};

export const movePaddleLeft = (paddle: GamePaddle): GamePaddle => {
  return {
    ...paddle,
    slide: -1 * PADDLE_SLIDE_SPEED,
  };
};

export const stopPaddle = (paddle: GamePaddle): GamePaddle => {
  return {
    ...paddle,
    slide: 0,
  };
};
