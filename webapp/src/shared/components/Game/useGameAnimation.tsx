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
  const drawBall = React.useCallback(
    (context: CanvasRenderingContext2D) => {
      const ball = ballRef.current;
      const paddle = paddleRef.current;
      ballRef.current = getBallPos(ball, paddle);
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
      paddleRef.current = getPaddlePos(paddleRef.current);
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

  return { drawBall, drawPaddle, drawBrick, resetGame };
};

export default useGameAnimation;
