import * as React from 'react';

import {
  CANVAS_WIDTH,
  BRICK_WIDTH,
  BRICK_HEIGHT,
  BALL_RADIUS,
  CANVAS_HEIGHT,
  GameBall,
  GamePaddle,
  GameState,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
} from 'pong-engine';

const useGameAnimation = () => {
  const deltaTimeRef = React.useRef<number>(0);

  const drawBall = React.useCallback(
    (context: CanvasRenderingContext2D, ball: GameBall) => {
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
    (context: CanvasRenderingContext2D, paddle: GamePaddle) => {
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

  const getScreenRefreshRate = React.useCallback((): Promise<number> => {
    // We want to calculate how many frames are rendered in one second (fps)
    // So we get the current UTC time plus 1000ms and count how many times
    // we loop inside requestAnimationFrame until we reach one second.

    const oneSecondTime = new Date().getTime() + 1000;

    const loop = (resolve: (value: number) => void, frames: number) => {
      const currTime = new Date().getTime();

      if (currTime < oneSecondTime) {
        window.requestAnimationFrame(() => loop(resolve, frames + 1));
      } else {
        resolve(frames);
      }
    };

    return new Promise((resolve) => {
      window.requestAnimationFrame(() => loop(resolve, 0));
    });
  }, []);

  React.useEffect(() => {
    getScreenRefreshRate().then((fps) => {
      deltaTimeRef.current = 1 / fps;
    });
  }, [getScreenRefreshRate]);

  const renderFrame = React.useCallback(
    (canvasContext: CanvasRenderingContext2D, state: GameState) => {
      const ball = state.ball;
      const paddle = state.paddle;

      canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      drawBall(canvasContext, ball);
      drawPaddle(canvasContext, paddle);
      drawBrick(canvasContext);
    },
    [drawBall, drawPaddle, drawBrick],
  );

  const renderMultiplayerFrame = React.useCallback(
    (
      canvasContext: CanvasRenderingContext2D,
      state: GameState,
      isPlayerOne: boolean,
    ) => {
      const ball = state.ball;
      const paddle = state.paddle;
      const paddleOpponent = state.paddleOpponent;

      canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      if (isPlayerOne) {
        drawBall(canvasContext, ball);
        drawPaddle(canvasContext, paddle);
        drawPaddle(canvasContext, paddleOpponent);
      } else {
        const ballRotated = {
          ...ball,
          x: CANVAS_WIDTH - ball.x,
          y: CANVAS_HEIGHT - ball.y,
        };
        const paddleRotated = {
          ...paddle,
          x: CANVAS_WIDTH - paddle.x - PADDLE_WIDTH,
          y: CANVAS_HEIGHT - paddle.y - PADDLE_HEIGHT,
        };
        const paddleOpponentRotated = {
          ...paddleOpponent,
          x: CANVAS_WIDTH - paddleOpponent.x - PADDLE_WIDTH,
          y: CANVAS_HEIGHT - paddleOpponent.y - PADDLE_HEIGHT,
        };
        drawBall(canvasContext, ballRotated);
        drawPaddle(canvasContext, paddleRotated);
        drawPaddle(canvasContext, paddleOpponentRotated);
      }
    },
    [drawBall, drawPaddle],
  );

  return { renderFrame, renderMultiplayerFrame, deltaTimeRef };
};

export default useGameAnimation;
