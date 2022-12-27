import * as React from 'react';

import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
import { GameBall, GamePaddle } from './types';
import { initialBallState, initialPaddleState, isLose, isWin } from './physics';
import useGameControls from './useGameControls';
import useGameAnimation from './useGameAnimation';

import './Game.css';

export default function Game() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const requestFrameRef = React.useRef<number | null>(null);
  const ballRef = React.useRef<GameBall>(initialBallState());
  const paddleRef = React.useRef<GamePaddle>(initialPaddleState());
  const [score, setScore] = React.useState(0);

  const { drawBall, drawPaddle, drawBrick, resetGame } = useGameAnimation(
    ballRef,
    paddleRef,
  );
  useGameControls(paddleRef);

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
          drawBall(context);
          drawPaddle(context);
        }
        window.requestAnimationFrame(() => loop(context, setScore));
      }
    },
    [drawBall, drawPaddle, drawBrick, resetGame],
  );

  React.useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      requestFrameRef.current = window.requestAnimationFrame(() =>
        loop(canvas.getContext('2d'), setScore),
      );

      return () => {
        if (requestFrameRef.current) {
          cancelAnimationFrame(requestFrameRef.current);
        }
      };
    }
  }, [loop]);

  return (
    <div className="game">
      <h1 className="game-score heading-bold">{score}</h1>
      <canvas className="game-arena" ref={canvasRef} />
    </div>
  );
}
