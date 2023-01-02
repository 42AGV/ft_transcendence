import * as React from 'react';

import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
// import { initialBallState, initialPaddleState, isLose, isWin } from './physics';
import useGameControls from './useGameControls';
import useGameAnimation from './useGameAnimation';
import socket from '../../socket';
import { UseGameState } from './useGameState';
import { isLose, isWin } from './physics';

import './Game.css';

const GAME_SERVER_MESSAGE = 'gameServerMessage';

export default function GameTrain() {
  const { renderFrame, deltaTimeRef } = useGameAnimation();
  const { gameStateRef, dispatch } = UseGameState();
  useGameControls();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const requestFrameRef = React.useRef<number | null>(null);
  const [score, setScore] = React.useState<number>(gameStateRef.current.score);

  const gameLoop = React.useCallback(() => {
    const canvasContext = canvasRef.current?.getContext('2d');
    const gameState = gameStateRef.current;
    const deltaTime = deltaTimeRef.current;
    setScore(gameState.score);

    if (canvasContext) {
      if (isLose(gameState.ball)) {
        dispatch({ type: 'lose', payload: {} });
      } else {
        if (isWin(gameState.ball)) {
          dispatch({ type: 'win', payload: {} });
        }
        dispatch({ type: 'move', payload: { deltaTime } });
      }
      renderFrame(canvasContext, gameState);
      window.requestAnimationFrame(() => gameLoop());
    }
  }, [dispatch, gameStateRef, renderFrame, deltaTimeRef]);

  React.useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      requestFrameRef.current = window.requestAnimationFrame(() => gameLoop());

      return () => {
        if (requestFrameRef.current) {
          cancelAnimationFrame(requestFrameRef.current);
        }
      };
    }
  }, [gameLoop]);

  // const updateGameState = React.useCallback(() => {}, []);

  // React.useEffect(() => {
  //   socket.on(GAME_SERVER_MESSAGE, updateGameState);

  //   return () => {
  //     socket.off(GAME_SERVER_MESSAGE);
  //   };
  // }, [updateGameState]);

  return (
    <div className="game">
      <h1 className="game-score heading-bold">{score}</h1>
      <canvas className="game-arena" ref={canvasRef} />
    </div>
  );
}
