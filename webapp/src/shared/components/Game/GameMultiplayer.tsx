import * as React from 'react';

import { CANVAS_WIDTH, CANVAS_HEIGHT } from 'pong-engine';
import { useGameControls, useGameAnimation, useGameEngine } from './hooks';
import { GameStateContextProvider } from './context';

import './GameMultiplayer.css';

const GameMultiplayerTraining = () => {
  const { renderMultiplayerFrame } = useGameAnimation();
  const { runGameMultiplayerFrame } = useGameEngine();
  useGameControls();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const requestFrameRef = React.useRef<number | null>(null);
  const [score, setScore] = React.useState<number>(0);
  const [opponentScore, setOpponentScore] = React.useState<number>(0);

  const gameLoop = React.useCallback(() => {
    const canvasContext = canvasRef.current?.getContext('2d');
    const gameState = runGameMultiplayerFrame();

    setScore(gameState.score);
    setOpponentScore(gameState.scoreOpponent);
    canvasContext && renderMultiplayerFrame(canvasContext, gameState);
    window.requestAnimationFrame(() => gameLoop());
  }, [runGameMultiplayerFrame, renderMultiplayerFrame]);

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
    <div className="game-multiplayer">
      <h1 className="game-multiplayer-score heading-bold">{opponentScore}</h1>
      <canvas className="game-multiplayer-arena" ref={canvasRef} />
      <h1 className="game-multiplayer-score heading-bold">{score}</h1>
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
