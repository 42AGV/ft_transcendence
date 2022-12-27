// speed magnitude is px/second
export const BALL_SPEED = 500;
export const CANVAS_WIDTH = 325;
export const CANVAS_HEIGHT = 500;
export const BRICK_WIDTH = 40;
export const BRICK_HEIGHT = 5;
export const PADDLE_WIDTH = 80;
export const PADDLE_HEIGHT = 8;
export const PADDLE_SLIDE_SPEED = 300;
export const BALL_RADIUS = 8;
export const MAX_PADDLE_BOUNCE_ANGLE = (5 / 6) * Math.PI;
export const MIN_PADDLE_BOUNCE_ANGLE = Math.PI - MAX_PADDLE_BOUNCE_ANGLE;
// const previousTimeRef = React.useRef<number | null>(null);
// Calcular tiempo, depende de la pantalla el refresh rate
export const DELTA_TIME = 1 / 60;
