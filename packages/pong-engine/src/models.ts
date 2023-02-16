type GameElement = {
  x: number;
  y: number;
  color: string;
};

export type GamePaddleMoveCommand =
  | 'paddleMoveRight'
  | 'paddleMoveLeft'
  | 'paddleStop';

export type GamePaddleOpponentMoveCommand =
  | 'paddleOpponentMoveRight'
  | 'paddleOpponentMoveLeft'
  | 'paddleOpponentStop';

export type GamePaddleDragCommand = 'paddleDrag' | 'paddleOpponentDrag';

export type GameCommand =
  | GamePaddleMoveCommand
  | GamePaddleOpponentMoveCommand
  | GamePaddleDragCommand;

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

export type GameState = {
  ball: GameBall;
  paddle: GamePaddle;
  paddleOpponent: GamePaddle;
  score: number;
  scoreOpponent: number;
};

export type PlayState = 'playing' | 'paused';

export type GameInfoClient = {
  gameState: GameState;
  playState: PlayState;
  playerOneId: string;
  playerTwoId: string;
};

export type GameInfoServer = GameInfoClient & {
  createdAt: number;
  pausedAt: number | null;
  playerOneLeftAt: number | null;
  playerTwoLeftAt: number | null;
};
