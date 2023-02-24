// speed magnitude is px/second
export const BALL_SPEED = 500;
export const CANVAS_WIDTH = 325;
export const CANVAS_HEIGHT = 500;
export const BRICK_WIDTH = 40;
export const BRICK_HEIGHT = 5;
export const PADDLE_WIDTH = 80;
export const SHORT_PADDLE_WIDTH = 40;
export const PADDLE_HEIGHT = 8;
export const PADDLE_SLIDE_SPEED = 400;
export const BALL_RADIUS = 8;
export const MAX_PADDLE_BOUNCE_ANGLE = (5 / 6) * Math.PI; // 150deg
export const MIN_PADDLE_BOUNCE_ANGLE = Math.PI - MAX_PADDLE_BOUNCE_ANGLE;
export const MAX_PADDLE_OPPONENT_BOUNCE_ANGLE =
  MIN_PADDLE_BOUNCE_ANGLE + Math.PI;
export const MIN_PADDLE_OPPONENT_BOUNCE_ANGLE =
  MAX_PADDLE_BOUNCE_ANGLE + Math.PI;
export const MISTERY_ZONE_HEIGH = 100;

export const getPaddleWidth = (short = false) =>
  short ? SHORT_PADDLE_WIDTH : PADDLE_WIDTH;
