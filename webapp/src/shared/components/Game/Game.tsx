import * as React from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT, GameCommand } from 'pong-engine';
import { useGameControls, useGameAnimation } from './hooks';
import { GameStateContextProvider } from './context/gameStateContext';
import Text, { TextVariant } from '../Text/Text';
import GameSpinner from '../GameSpinner/GameSpinner';
import Header from '../Header/Header';
import { IconVariant } from '../Icon/Icon';
import { useNavigation } from '../../hooks/UseNavigation';
import { useGameEngine } from './hooks';
import Button, { ButtonVariant } from '../Button/Button';
import { useOnlineGame } from './hooks/useOnlineGame';

import './Game.css';

type GameProps = {
  gameId: string;
};

type GameStatusHandlerProps = {
  gameId: string;
};

type PlayProps = {
  isPlayerOne: boolean;
  sendGameCommand: (command: GameCommand) => void;
};

const GameStatusHandler = ({ gameId }: GameStatusHandlerProps) => {
  const { gameJoined, joinGame, isPlayerOne, isGamePaused, sendGameCommand } =
    useOnlineGame(gameId);
  if (!gameJoined) {
    return (
      <div className="game-start">
        <Button variant={ButtonVariant.SUBMIT} onClick={joinGame}>
          Ready?
        </Button>
      </div>
    );
  }

  if (isGamePaused) {
    return <Wait />;
  }

  return <Play isPlayerOne={isPlayerOne} sendGameCommand={sendGameCommand} />;
};

const Play = ({ isPlayerOne, sendGameCommand }: PlayProps) => {
  const { renderMultiplayerFrame } = useGameAnimation();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const requestFrameRef = React.useRef<number | null>(null);
  const { runGameMultiplayerFrame } = useGameEngine();
  useGameControls(sendGameCommand, isPlayerOne);
  const [score, setScore] = React.useState<number>(0);
  const [opponentScore, setOpponentScore] = React.useState<number>(0);
  const shouldRunFrameRef = React.useRef(true);

  const gameLoop = React.useCallback(() => {
    const canvasContext = canvasRef.current?.getContext('2d');
    const gameState = runGameMultiplayerFrame(isPlayerOne);
    setScore(gameState.score);
    setOpponentScore(gameState.scoreOpponent);
    canvasContext &&
      renderMultiplayerFrame(canvasContext, gameState, isPlayerOne);
    shouldRunFrameRef.current && window.requestAnimationFrame(() => gameLoop());
  }, [
    runGameMultiplayerFrame,
    renderMultiplayerFrame,
    shouldRunFrameRef,
    isPlayerOne,
  ]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      shouldRunFrameRef.current = true;
      requestFrameRef.current = window.requestAnimationFrame(() => gameLoop());

      return () => {
        if (requestFrameRef.current) {
          cancelAnimationFrame(requestFrameRef.current);
        }
        shouldRunFrameRef.current = false;
      };
    }
  }, [gameLoop]);

  return (
    <div className="game-multiplayer">
      <h1 className="game-multiplayer-score heading-bold">
        {isPlayerOne ? opponentScore : score}
      </h1>
      <canvas
        className="game-multiplayer-arena"
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <h1 className="game-multiplayer-score heading-bold">
        {isPlayerOne ? score : opponentScore}
      </h1>
    </div>
  );
};

const Wait = () => {
  return (
    <div className="game-wait">
      <GameSpinner scaleInPercent={150} />
      <div className="game-wait-text">
        <Text variant={TextVariant.PARAGRAPH}>Waiting for opponent...</Text>
      </div>
    </div>
  );
};

export default function Game({ gameId }: GameProps) {
  const { goBack } = useNavigation();

  return (
    <GameStateContextProvider>
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack}>
        Quick match
      </Header>
      <div className="game">
        <GameStatusHandler gameId={gameId} />
      </div>
    </GameStateContextProvider>
  );
}
