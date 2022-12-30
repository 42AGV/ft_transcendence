type GameElement = {
  x: number;
  y: number;
  color: string;
};

export type GamePaddle = GameElement & {
  slide: number;
  width: number;
  height: number;
};

export type GameBall = GameElement & {
  vx: number;
  vy: number;
  radius: number;
};

export type Coord = {
  x: number;
  y: number;
};
