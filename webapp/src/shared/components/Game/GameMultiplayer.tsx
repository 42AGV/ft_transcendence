import * as React from 'react';

import { CANVAS_WIDTH, CANVAS_HEIGHT } from 'pong-engine';
import { useGameControls, useGameAnimation, useGameEngine } from './hooks';
import { GameStateContextProvider } from './context';

import './Game.css';

const GameMultiplayerTraining = () => {
  const { renderFrame } = useGameAnimation();
  const { runGameFrame } = useGameEngine();
  useGameControls();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const requestFrameRef = React.useRef<number | null>(null);
  const [score, setScore] = React.useState<number>(0);

  const gameLoop = React.useCallback(() => {
    const canvasContext = canvasRef.current?.getContext('2d');
    const gameState = runGameFrame();

    setScore(gameState.score);
    canvasContext && renderFrame(canvasContext, gameState);
    window.requestAnimationFrame(() => gameLoop());
  }, [runGameFrame, renderFrame]);

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

  return (
    <div className="game">
      <h1 className="game-score heading-bold">{score}</h1>
      <canvas className="game-arena" ref={canvasRef} />
    </div>
  );
};

export default function GameMultiplayerTrainingWithContext() {
  return (
    <GameStateContextProvider>
      <GameMultiplayerTraining />
    </GameStateContextProvider>
  );
}
