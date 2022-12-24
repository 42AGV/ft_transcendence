import * as React from 'react';

import './Game.css';

// speed magnitude is px/second
const BALL_SPEED = 400;
const CANVAS_WIDTH = 325;
const CANVAS_HEIGHT = 500;
const BRICK_WIDTH = 40;
const BRICK_HEIGHT = 5;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 8;
const PADDLE_SLIDE_SPEED = 300;
const BALL_RADIUS = 8;
const MAX_PADDLE_BOUNCE_ANGLE = (5 / 6) * Math.PI;
const MIN_PADDLE_BOUNCE_ANGLE = Math.PI - MAX_PADDLE_BOUNCE_ANGLE;
// const previousTimeRef = React.useRef<number | null>(null);
// Calcular tiempo, depende de la pantalla el refresh rate
const DELTA_TIME = 1 / 60;

type GameElement = {
  x: number;
  y: number;
  color: string;
};

type GamePaddle = GameElement & {
  slide: number;
  width: number;
  height: number;
};

type GameBall = GameElement & {
  vx: number;
  vy: number;
  radius: number;
};

type Coord = {
  x: number;
  y: number;
};

const bounceOpposite = (ballRef: React.MutableRefObject<GameBall>) => {
  const ball = ballRef.current;

  ballRef.current = {
    ...ball,
    vx: -1 * ball.vx,
    vy: -1 * ball.vx,
    x: ball.x - ball.vx * DELTA_TIME,
    y: ball.y - ball.vy * DELTA_TIME,
  };
};

const bounceVert = (ballRef: React.MutableRefObject<GameBall>) => {
  const ball = ballRef.current;

  ballRef.current = {
    ...ball,
    vx: -1 * ball.vx,
    x: ball.x - ball.vx * DELTA_TIME,
    y: ball.y + ball.vy * DELTA_TIME,
  };
};

const bounceHor = (ballRef: React.MutableRefObject<GameBall>) => {
  const ball = ballRef.current;

  ballRef.current = {
    ...ball,
    vy: -1 * ball.vy,
    x: ball.x + ball.vx * DELTA_TIME,
    y: ball.y - ball.vy * DELTA_TIME,
  };
};

const bounceArkanoid = (
  ballRef: React.MutableRefObject<GameBall>,
  paddle: GamePaddle,
) => {
  const ball = ballRef.current;
  const paddleBallDistance = ball.x - paddle.x;
  const bounceAngle =
    MAX_PADDLE_BOUNCE_ANGLE -
    (paddleBallDistance / PADDLE_WIDTH) *
      (MAX_PADDLE_BOUNCE_ANGLE - MIN_PADDLE_BOUNCE_ANGLE);
  const newVx = BALL_SPEED * Math.cos(bounceAngle);
  const newVy = BALL_SPEED * -1 * Math.sin(bounceAngle);

  ballRef.current = {
    ...ball,
    vx: newVx,
    vy: newVy,
    x: ball.x + newVx * DELTA_TIME,
    y: ball.y + newVy * DELTA_TIME,
  };
};

const move = (ballRef: React.MutableRefObject<GameBall>) => {
  const ball = ballRef.current;

  ballRef.current = {
    ...ball,
    x: ball.x + ball.vx * DELTA_TIME,
    y: ball.y + ball.vy * DELTA_TIME,
  };
};

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

const calcBallPos = (
  ballRef: React.MutableRefObject<GameBall>,
  paddle: GamePaddle,
) => {
  const ball = ballRef.current;

  if (cornerCollision(ball)) {
    bounceOpposite(ballRef);
  } else if (vertWallCollision(ball)) {
    bounceVert(ballRef);
  } else if (horWallCollision(ball)) {
    bounceHor(ballRef);
  } else if (paddleCollision(ball, paddle)) {
    bounceArkanoid(ballRef, paddle);
  } else {
    move(ballRef);
  }
};

const calcPaddlePos = (paddleRef: React.MutableRefObject<GamePaddle>) => {
  const paddle = paddleRef.current;

  if (
    (paddle.x > 0 && paddle.slide < 0) ||
    (paddle.x < CANVAS_WIDTH - PADDLE_WIDTH && paddle.slide > 0)
  ) {
    paddleRef.current = {
      ...paddle,
      x: paddle.x + paddle.slide * DELTA_TIME,
    };
  }
};

const calcInitialBallSpeed = (): Coord => {
  const coef = Math.ceil(3 * Math.random());
  const angle = (Math.PI / 2) * coef + Math.PI / 4;

  return {
    x: BALL_SPEED * Math.cos(angle),
    y: BALL_SPEED * Math.sin(angle),
  };
};

const initialBallState = (): GameBall => {
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

const initialPaddleState = (): GamePaddle => ({
  x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
  y: CANVAS_HEIGHT - 2 * PADDLE_HEIGHT,
  slide: 0,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  color: '#FFF',
});

const isLose = (ball: GameBall) => ball.y > 1.5 * CANVAS_HEIGHT;

const isWin = (ball: GameBall) =>
  ball.y <= BALL_RADIUS &&
  ball.x >= CANVAS_WIDTH / 2 - BRICK_WIDTH / 2 &&
  ball.x <= CANVAS_WIDTH / 2 + BRICK_WIDTH / 2;

export default function Game() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const requestFrameRef = React.useRef<number | null>(null);
  const ballRef = React.useRef<GameBall>(initialBallState());
  const paddleRef = React.useRef<GamePaddle>(initialPaddleState());
  const dragRef = React.useRef<number>(0);
  const [score, setScore] = React.useState(0);

  const drawBall = React.useCallback(
    (
      context: CanvasRenderingContext2D,
      ballRef: React.MutableRefObject<GameBall>,
    ) => {
      const ball = ballRef.current;
      const paddle = paddleRef.current;
      calcBallPos(ballRef, paddle);
      context.beginPath();
      context.arc(ball.x, ball.y, BALL_RADIUS, 0, 2 * Math.PI, false);
      context.fillStyle = ball.color;
      context.fill();
      context.lineWidth = 1;
      context.strokeStyle = ball.color;
      context.stroke();
    },
    [],
  );

  const drawPaddle = React.useCallback(
    (
      context: CanvasRenderingContext2D,
      paddleRef: React.MutableRefObject<GamePaddle>,
    ) => {
      const paddle = paddleRef.current;
      calcPaddlePos(paddleRef);
      context.fillStyle = paddle.color;
      context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    },
    [],
  );
  const drawBrick = React.useCallback((context: CanvasRenderingContext2D) => {
    context.fillStyle = '#FFF';
    context.fillRect(
      CANVAS_WIDTH / 2 - BRICK_WIDTH / 2,
      0,
      BRICK_WIDTH,
      BRICK_HEIGHT,
    );
  }, []);

  const resetGame = React.useCallback(
    (ballRef: React.MutableRefObject<GameBall>) => {
      ballRef.current = initialBallState();
    },
    [],
  );

  const loop = React.useCallback(
    (
      context: CanvasRenderingContext2D | null,
      setScore: React.Dispatch<React.SetStateAction<number>>,
    ) => {
      if (context) {
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        drawBrick(context);
        if (isLose(ballRef.current)) {
          setScore((prev) => prev - 1);
          resetGame(ballRef);
        } else {
          if (isWin(ballRef.current)) {
            setScore((prev) => prev + 1);
          }
          drawBall(context, ballRef);
          drawPaddle(context, paddleRef);
        }
        window.requestAnimationFrame(() => loop(context, setScore));
      }
    },
    [drawBall, drawPaddle, drawBrick, resetGame],
  );

  const movePaddle = React.useCallback((e: KeyboardEvent) => {
    const key = e.key;
    const paddle = paddleRef.current;

    if (key === 'ArrowRight') {
      paddleRef.current = {
        ...paddle,
        slide: PADDLE_SLIDE_SPEED,
      };
    } else if (key === 'ArrowLeft') {
      paddleRef.current = {
        ...paddle,
        slide: -1 * PADDLE_SLIDE_SPEED,
      };
    }
  }, []);

  const dragPaddle = React.useCallback((e: TouchEvent) => {
    const paddle = paddleRef.current;
    const dragPos = dragRef.current;
    dragRef.current = e.touches[0].clientX;

    if (dragPos)
      paddleRef.current = {
        ...paddle,
        x: paddle.x - (dragPos - dragRef.current),
      };
  }, []);

  const stopPaddle = React.useCallback((e: KeyboardEvent) => {
    const key = e.key;
    const paddle = paddleRef.current;

    if (key === 'ArrowRight' || key === 'ArrowLeft') {
      paddleRef.current = {
        ...paddle,
        slide: 0,
      };
    }
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      requestFrameRef.current = window.requestAnimationFrame(() =>
        loop(canvas.getContext('2d'), setScore),
      );
      window.addEventListener('keydown', movePaddle, false);
      window.addEventListener('keyup', stopPaddle, false);
      window.addEventListener('touchmove', dragPaddle, false);
      window.addEventListener('contextmenu', (e) => e.preventDefault());

      return () => {
        if (requestFrameRef.current) {
          cancelAnimationFrame(requestFrameRef.current);
        }
      };
    }
  }, [loop, movePaddle, stopPaddle, dragPaddle]);

  return (
    <div className="game">
      <h1 className="game-score heading-bold">{score}</h1>
      <canvas className="game-arena" ref={canvasRef} />
    </div>
  );
}
