import * as React from 'react';

import {
  CANVAS_WIDTH,
  BRICK_WIDTH,
  BRICK_HEIGHT,
  BALL_RADIUS,
} from './constants';
import { GameBall, GamePaddle } from './types';
import { getBallPos, getPaddlePos, initialBallState } from './physics';

const useGameAnimation = (
  ballRef: React.MutableRefObject<GameBall>,
  paddleRef: React.MutableRefObject<GamePaddle>,
) => {
  const deltaTimeRef = React.useRef<number>(0);

  const drawBall = React.useCallback(
    (context: CanvasRenderingContext2D) => {
      const ball = ballRef.current;
      const paddle = paddleRef.current;

      ballRef.current = getBallPos(ball, paddle, deltaTimeRef.current);
      context.beginPath();
      context.arc(ball.x, ball.y, BALL_RADIUS, 0, 2 * Math.PI, false);
      context.fillStyle = ball.color;
      context.fill();
      context.lineWidth = 1;
      context.strokeStyle = ball.color;
      context.stroke();
    },
    [paddleRef, ballRef],
  );

  const drawPaddle = React.useCallback(
    (context: CanvasRenderingContext2D) => {
      const paddle = paddleRef.current;
      paddleRef.current = getPaddlePos(paddleRef.current, deltaTimeRef.current);
      context.fillStyle = paddle.color;
      context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    },
    [paddleRef],
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

  return { drawBall, drawPaddle, drawBrick, resetGame };
};

export default useGameAnimation;
